import express, { type ErrorRequestHandler } from "express";
import type { Request, Response } from "express";
import { canonicalJson, describeAjvErrors, validateClassCode, validatePack, validateProgressEvent } from "./validation.js";
import { snapshot, transact, type Pack, type ProgressEvent, type StoredEvent } from "./store.js";

const app = express();
app.disable("x-powered-by");

const allowedOrigins = new Set(
  (process.env.CORS_ORIGINS ?? "http://localhost:5173,http://127.0.0.1:5173")
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

function packValidationDetails(pack: unknown): string[] {
  validatePack(pack);
  return describeAjvErrors(validatePack.errors);
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
    const existing = state.packs[pack.id];
    if (existing?.review.status === "approved") {
      return { value: { status: 409 as const, body: { error: "pack_already_approved" } }, changed: false };
    }
    state.packs[pack.id] = pack;
    return {
      value: { status: 200 as const, body: { pack, source: "assisted" as const } },
      changed: true,
    };
  });
  res.status(result.status).json(result.body);
});

app.post("/api/review/approve", async (req: Request, res: Response) => {
  const packId = isRecord(req.body) && typeof req.body.packId === "string" ? req.body.packId : "";
  const reviewer = isRecord(req.body) && typeof req.body.reviewer === "string" ? req.body.reviewer.trim() : "";
  if (!packId || !reviewer) {
    res.status(422).json({ error: "invalid_review", details: ["packId y reviewer son obligatorios"] });
    return;
  }

  const result = await transact<HttpResult>((state) => {
    const pack = state.packs[packId];
    if (!pack) return { value: { status: 404 as const, body: { error: "pack_not_found" } }, changed: false };
    if (pack.review.status !== "draft") {
      return { value: { status: 409 as const, body: { error: "pack_not_draft" } }, changed: false };
    }

    const reviewedAt = new Date().toISOString();
    const approvedPack: Pack = {
      ...pack,
      review: { ...pack.review, status: "approved", reviewedBy: reviewer, reviewedAt },
    };
    const details = packValidationDetails(approvedPack);
    if (details.length > 0) {
      return {
        value: { status: 422 as const, body: { error: "validation_failed", details } },
        changed: false,
      };
    }
    state.packs[packId] = approvedPack;
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

app.get("/api/packs/:id", async (req: Request, res: Response) => {
  const state = await snapshot();
  const pack = state.packs[String(req.params.id)];
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
      const existing = seen.get(eventId) ?? state.events[eventId];
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
    for (const [eventId, record] of pending) state.events[eventId] = record;
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
  const events = Object.values(state.events).filter((item) => item.classCode === classCode);
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
