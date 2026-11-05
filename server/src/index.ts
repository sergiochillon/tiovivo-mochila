import "dotenv/config";
import express, { type ErrorRequestHandler } from "express";
import type { Request, Response } from "express";
import { randomUUID } from "node:crypto";
import { canonicalJson, describeAjvErrors, validateClassCode, validatePack, validateProgressEvent } from "./validation.js";
import { snapshot, transact, type Pack, type ProgressEvent, type StoredEvent } from "./store.js";
import { generateJsonWithGemini, GeminiBusyError, GeminiNotConfiguredError } from "./gemini.js";
import { buildGenerationPrompt, contextForPack, parseGenerationContext, topics } from "./prompt.js";

const app = express();
app.disable("x-powered-by");

const allowedOrigins = new Set(
  (
    process.env.CORS_ORIGINS ??
    "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173,http://127.0.0.1:4173"
  )
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
);

app.use((req, res, next) => {
  const origin = req.header("origin");
  if (origin) {
    if (!allowedOrigins.has(origin)) {
      res.status(403).json({ error: "origin_not_allowed" });
      return;
    }
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  next();
});

app.use(express.json({ limit: "1mb", strict: true }));

// Log only method and status; request bodies and child progress are never logged.
app.use((req, res, next) => {
  res.on("finish", () => console.info(`${req.method} ${res.statusCode}`));
  next();
});

type JsonRecord = Record<string, unknown>;
type HttpResult = { status: number; body: JsonRecord };
const isRecord = (value: unknown): value is JsonRecord =>
  typeof value === "object" && value !== null && !Array.isArray(value);

// Checks the schema cannot express: every "correct" answer must point at an existing option,
// and an "order" activity must list every option exactly once. Otherwise a child could never finish it.
function semanticDetails(pack: unknown): string[] {
  const details: string[] = [];
  const modules = isRecord(pack) && Array.isArray(pack.modules) ? pack.modules : [];
  modules.forEach((module, moduleIndex) => {
    const activities = isRecord(module) && Array.isArray(module.activities) ? module.activities : [];
    activities.forEach((activity, activityIndex) => {
      if (!isRecord(activity) || activity.correct === undefined) return;
      const ids = Array.isArray(activity.options)
        ? activity.options.map((option) => (isRecord(option) ? option.id : undefined))
        : [];
      const correct = Array.isArray(activity.correct) ? activity.correct : [activity.correct];
      const where = `/modules/${moduleIndex}/activities/${activityIndex}/correct`;
      if (new Set(ids).size !== ids.length) {
        details.push(`/modules/${moduleIndex}/activities/${activityIndex}/options: hay opciones con el mismo id`);
      } else if (activity.type === "match") {
        // match pairs are "idA:idB" (ids cannot contain ":"): both sides must be existing options.
        const pairs = correct.map((pair) => String(pair).split(":"));
        const pairedIds = pairs.flat();
        if (
          pairs.some((pair) => pair.length !== 2 || pair[0] === pair[1] || pair.some((id) => !ids.includes(id))) ||
          pairedIds.length !== ids.length ||
          new Set(pairedIds).size !== pairedIds.length
        ) {
          details.push(`${where}: las parejas deben unir cada opción exactamente una vez («idA:idB»)`);
        }
      } else if (correct.some((id) => !ids.includes(id))) {
        details.push(`${where}: la respuesta correcta no coincide con ninguna opción`);
      } else if (activity.type === "order" && (correct.length !== ids.length || new Set(correct).size !== ids.length)) {
        details.push(`${where}: el orden correcto debe incluir cada opción una sola vez`);
      }
    });
  });
  return details;
}

// Seal note on approval: states what was really done and keeps the draft's specific observations,
// dropping only the transitional "pending review" sentences that the seal makes obsolete.
/** The six points a person confirms in /autoria before approving. The server checks them too, so a direct
 *  API call cannot approve a pack without the review (contracts/sync-api.md). */
export const REVIEW_CHECKLIST = [
  "una-idea-por-actividad",
  "lenguaje-6-10",
  "feedback-amable",
  "contexto-local-marcado",
  "sin-estereotipos",
  "sin-datos-y-seguro",
] as const;

function approvalNotes(reviewer: string, reviewedAt: string, previous: unknown): string {
  const draft = typeof previous === "string" ? previous : "";
  const fromAi = /\b(IA|AI)\b/.test(draft);
  const observations = draft
    .replace(/(Generado con IA|Propuesta asistida con IA externa|Generated with AI)\.?/gi, "")
    .replace(/(Pendiente|Pending)[^.]*\.?/gi, "")
    .replace(/\s+/g, " ")
    .trim();
  return (
    `Revisión pedagógica aprobada por ${reviewer} el ${reviewedAt.slice(0, 10)} con la lista de revisión de ${REVIEW_CHECKLIST.length} puntos completa. ` +
    "La validación cultural local sigue pendiente. No probado con niños." +
    (fromAi ? " Propuesta generada con IA y revisada por una persona." : "") +
    (observations ? ` Observaciones del borrador: ${observations}` : "")
  );
}

function packValidationDetails(pack: unknown): string[] {
  validatePack(pack);
  const schemaDetails = describeAjvErrors(validatePack.errors);
  return schemaDetails.length > 0 ? schemaDetails : semanticDetails(pack);
}

app.post("/api/generate", async (req: Request, res: Response) => {
  if (!isRecord(req.body) || !isRecord(req.body.pack)) {
    res.status(422).json({
      error: "validation_failed",
      details: ["pack debe ser un objeto conforme a pack-v0.1"],
    });
    return;
  }

  const pack = structuredClone(req.body.pack) as Pack;
  if (!isRecord(pack.review)) {
    res.status(422).json({
      error: "validation_failed",
      details: ["pack.review debe ser un objeto con status draft"],
    });
    return;
  }

  // Approval fields from pasted JSON are untrusted; only the review endpoint can seal a pack.
  pack.review = { ...pack.review, status: "draft" };
  delete pack.review.reviewedBy;
  delete pack.review.reviewedAt;

  const details = packValidationDetails(pack);
  if (details.length > 0) {
    res.status(422).json({ error: "validation_failed", details });
    return;
  }

  const result = await transact<HttpResult>((state) => {
    const existing = state.packs.get(pack.id);
    if (existing?.review.status === "approved") {
      return { value: { status: 409 as const, body: { error: "pack_already_approved" } }, changed: false };
    }
    state.packs.set(pack.id, pack);
    return {
      value: { status: 200 as const, body: { pack, source: "assisted" as const } },
      changed: true,
    };
  });
  res.status(result.status).json(result.body);
});

app.get("/api/topics", (_req: Request, res: Response) => {
  res.status(200).json({ topics: Object.keys(topics) });
});

app.get("/api/prompt", async (req: Request, res: Response) => {
  const query = new URL(req.originalUrl, "http://localhost").searchParams;
  const context = parseGenerationContext({
    country: query.get("country"),
    region: query.get("region"),
    language: query.get("language"),
    foods: query.getAll("foods"),
    topic: query.get("topic") ?? undefined,
    communityType: query.get("communityType") ?? undefined,
    resources: query.getAll("resources"),
  });
  if (!context) {
    res.status(422).json({
      error: "invalid_generation_context",
      details: ["Indica country, region y language (es|en); foods (0–12), resources (0–8), topic y communityType son opcionales."],
    });
    return;
  }
  res.status(200).json({ prompt: await buildGenerationPrompt(context) });
});

app.post("/api/generate/ai", async (req: Request, res: Response) => {
  const context = isRecord(req.body) ? parseGenerationContext(req.body.context) : undefined;
  if (!context) {
    res.status(422).json({ error: "invalid_generation_context" });
    return;
  }

  let generated: unknown;
  try {
    generated = await generateJsonWithGemini(await buildGenerationPrompt(context));
  } catch (error) {
    if (error instanceof GeminiNotConfiguredError) {
      res.status(503).json({ error: "ai_not_configured" });
      return;
    }
    if (error instanceof GeminiBusyError) {
      res.status(503).json({ error: "ai_busy", reason: error.reason });
      return;
    }
    res.status(502).json({ error: "ai_generation_failed" });
    return;
  }

  if (!isRecord(generated)) {
    res.status(502).json({ error: "ai_invalid_package" });
    return;
  }
  const pack = structuredClone(generated) as Pack;
  pack.id = `demo-generado-${randomUUID()}`;
  pack.packVersion = "0.1";
  pack.language = context.language;
  const generatedFoods = isRecord(pack.context) && Array.isArray(pack.context.foods)
    ? pack.context.foods.filter((food): food is string => typeof food === "string" && food.trim().length > 0 && food.length <= 100).slice(0, 12)
    : [];
  pack.context = contextForPack(context, generatedFoods);
  pack.review = {
    status: "draft",
    notes: "Generado con IA. Pendiente de revisión pedagógica y validación local.",
  };
  if (Array.isArray(pack.modules)) {
    for (const module of pack.modules) {
      if (isRecord(module) && Array.isArray(module.activities)) {
        for (const activity of module.activities) {
          if (isRecord(activity)) {
            // Keep the AI's justification (useful for the teacher) but always flag local validation.
            const note = typeof activity.teacherNotes === "string" ? activity.teacherNotes.trim().slice(0, 440) : "";
            activity.teacherNotes = note
              ? (/A VALIDAR/.test(note) ? note : `A VALIDAR · ${note}`)
              : "A VALIDAR: revisar el contenido y confirmar vocabulario y contexto local.";
          }
        }
      }
    }
  }

  const details = packValidationDetails(pack);
  if (details.length > 0) {
    res.status(502).json({ error: "ai_invalid_package", details });
    return;
  }

  await transact((state) => {
    state.packs.set(pack.id, pack);
    return { value: undefined, changed: true };
  });
  res.status(201).json({ pack, source: "gemini" });
});

app.get("/api/drafts/:id", async (req: Request, res: Response) => {
  const state = await snapshot();
  const pack = state.packs.get(String(req.params.id));
  if (!pack || pack.review.status !== "draft") {
    res.status(404).json({ error: "draft_not_found" });
    return;
  }
  res.status(200).json(pack);
});

app.post("/api/review/approve", async (req: Request, res: Response) => {
  const packId = isRecord(req.body) && typeof req.body.packId === "string" ? req.body.packId : "";
  const reviewerInput = isRecord(req.body) ? req.body.reviewer : undefined;
  const reviewer = typeof reviewerInput === "string"
    ? reviewerInput.trim().replace(/[\u0000-\u001f\u007f]/g, " ")
    : "";
  if (!packId || !reviewer || reviewer.length > 100) {
    res.status(422).json({ error: "invalid_review", details: ["packId y reviewer (1–100 caracteres) son obligatorios"] });
    return;
  }
  const confirmed = isRecord(req.body) && Array.isArray(req.body.checklist) ? req.body.checklist : [];
  const missing = REVIEW_CHECKLIST.filter((point) => !confirmed.includes(point));
  if (missing.length > 0) {
    res.status(422).json({ error: "checklist_incomplete", details: missing.map((point) => `Falta confirmar: ${point}`) });
    return;
  }

  const result = await transact<HttpResult>((state) => {
    const pack = state.packs.get(packId);
    if (!pack) return { value: { status: 404 as const, body: { error: "pack_not_found" } }, changed: false };
    if (pack.review.status !== "draft") {
      return { value: { status: 409 as const, body: { error: "pack_not_draft" } }, changed: false };
    }

    const reviewedAt = new Date().toISOString();
    const approvedPack: Pack = {
      ...pack,
      // Rewrite the notes: draft notes ("pending pedagogical review") must not survive the seal.
      review: {
        ...pack.review,
        status: "approved",
        reviewedBy: reviewer,
        reviewedAt,
        notes: approvalNotes(reviewer, reviewedAt, pack.review.notes),
      },
    };
    const details = packValidationDetails(approvedPack);
    if (details.length > 0) {
      return {
        value: { status: 422 as const, body: { error: "validation_failed", details } },
        changed: false,
      };
    }
    state.packs.set(packId, approvedPack);
    return {
      value: {
        status: 200 as const,
        body: { packId, status: "approved" as const, reviewedBy: reviewer, reviewedAt },
      },
      changed: true,
    };
  });
  res.status(result.status).json(result.body);
});

app.get("/api/packs", async (_req: Request, res: Response) => {
  const state = await snapshot();
  const packs = [...state.packs.values()]
    .filter((pack) => pack.review.status === "approved")
    .sort((a, b) => a.id.localeCompare(b.id));
  res.status(200).json({ packs });
});

app.get("/api/packs/:id", async (req: Request, res: Response) => {
  const state = await snapshot();
  const pack = state.packs.get(String(req.params.id));
  if (!pack || pack.review.status !== "approved") {
    res.status(404).json({ error: "approved_pack_not_found" });
    return;
  }
  res.status(200).json(pack);
});

type SyncCandidate = { classCode: string; event: ProgressEvent };
type SyncReply =
  | { status: 200; body: { accepted: number; alreadyPresent: number } }
  | { status: 409; body: { error: "event_id_conflict"; details: Array<{ eventIndex: number; eventId: string; reason: string }> } };

function syncErrors(
  events: unknown[],
  classCode: string,
): Array<{ eventIndex: number; eventId: string | null; reason: string }> {
  const details: Array<{ eventIndex: number; eventId: string | null; reason: string }> = [];
  if (typeof classCode !== "string" || !validateClassCode(classCode)) {
    details.push({ eventIndex: -1, eventId: null, reason: "classCode inválido" });
  }
  events.forEach((event, eventIndex) => {
    const eventId = isRecord(event) && typeof event.eventId === "string" ? event.eventId : null;
    if (!validateProgressEvent(event)) {
      for (const reason of describeAjvErrors(validateProgressEvent.errors)) {
        details.push({ eventIndex, eventId, reason });
      }
      return;
    }
    if (event.classCode !== undefined && event.classCode !== classCode) {
      details.push({ eventIndex, eventId, reason: "event.classCode debe coincidir con classCode del lote" });
    }
  });
  return details;
}

app.post("/api/sync", async (req: Request, res: Response) => {
  if (!isRecord(req.body) || !Array.isArray(req.body.events)) {
    res.status(422).json({
      error: "validation_failed",
      details: [{ eventIndex: -1, eventId: null, reason: "events debe ser una lista" }],
    });
    return;
  }
  const classCode = typeof req.body.classCode === "string" ? req.body.classCode : "";
  const events = req.body.events as unknown[];
  const details = syncErrors(events, classCode);
  if (details.length > 0) {
    res.status(422).json({ error: "validation_failed", details });
    return;
  }

  const candidates: SyncCandidate[] = events.map((value) => {
    const event = structuredClone(value) as ProgressEvent;
    delete event.classCode;
    return { classCode, event };
  });

  const result = await transact<SyncReply>((state) => {
    const seen = new Map<string, StoredEvent>();
    const pending: Array<[string, StoredEvent]> = [];
    const conflicts: Array<{ eventIndex: number; eventId: string; reason: string }> = [];
    let accepted = 0;
    let alreadyPresent = 0;

    candidates.forEach((candidate, eventIndex) => {
      const eventId = candidate.event.eventId;
      const record: StoredEvent = candidate;
      const existing = seen.get(eventId) ?? state.events.get(eventId);
      if (existing) {
        if (canonicalJson(existing) !== canonicalJson(record)) {
          conflicts.push({ eventIndex, eventId, reason: "eventId ya existe con contenido distinto" });
        } else {
          alreadyPresent += 1;
        }
        return;
      }
      seen.set(eventId, record);
      pending.push([eventId, record]);
      accepted += 1;
    });

    if (conflicts.length > 0) {
      return {
        value: { status: 409 as const, body: { error: "event_id_conflict" as const, details: conflicts } },
        changed: false,
      };
    }
    for (const [eventId, record] of pending) state.events.set(eventId, record);
    return {
      value: { status: 200 as const, body: { accepted, alreadyPresent } },
      changed: pending.length > 0,
    };
  });
  res.status(result.status).json(result.body);
});

app.get("/api/progress/:classCode", async (req: Request, res: Response) => {
  const classCode = String(req.params.classCode);
  if (!validateClassCode(classCode)) {
    res.status(400).json({ error: "invalid_class_code" });
    return;
  }
  const state = await snapshot();
  const events = Array.from(state.events.values()).filter((item) => item.classCode === classCode);
  const activitiesCompleted = events.filter(
    ({ event }) => event.result === "correct" || event.result === "completed",
  ).length;
  res.status(200).json({ classCode, eventsReceived: events.length, activitiesCompleted });
});

app.use((_req, res) => {
  res.status(404).json({ error: "not_found" });
});

const errorHandler: ErrorRequestHandler = (error: unknown, _req, res, _next) => {
  if (isRecord(error) && error.type === "entity.parse.failed") {
    res.status(400).json({ error: "invalid_json" });
    return;
  }
  if (isRecord(error) && error.type === "entity.too.large") {
    res.status(413).json({ error: "payload_too_large" });
    return;
  }
  console.error("Request failed");
  res.status(500).json({ error: "internal_error" });
};
app.use(errorHandler);

const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? "127.0.0.1";
app.listen(port, host, () => {
  console.info(`MOCHILA API listening at http://${host}:${port}`);
});
