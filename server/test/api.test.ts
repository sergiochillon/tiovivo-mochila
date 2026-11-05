import assert from "node:assert/strict";
import { spawn, type ChildProcess } from "node:child_process";
import { once } from "node:events";
import { createServer } from "node:net";
import { createServer as createHttpServer, type Server } from "node:http";
import { readFile } from "node:fs/promises";
import { mkdtemp, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { after, before, test } from "node:test";

const serverRoot = new URL("..", import.meta.url).pathname;
let child: ChildProcess | undefined;
let baseUrl = "";
let dataDir = "";
let childOutput = "";
let fakeGemini: Server | undefined;
let fakeGeminiModel = "";

async function freePort(): Promise<number> {
  const socket = createServer();
  await new Promise<void>((resolve, reject) => {
    socket.once("error", reject);
    socket.listen(0, "127.0.0.1", resolve);
  });
  const address = socket.address();
  assert(address && typeof address !== "string");
  await new Promise<void>((resolve, reject) => socket.close((error) => error ? reject(error) : resolve()));
  return address.port;
}

async function waitForServer(): Promise<void> {
  const deadline = Date.now() + 10_000;
  let lastError: unknown;
  while (Date.now() < deadline) {
    if (child?.exitCode !== null && child?.exitCode !== undefined) {
      throw new Error(`Servidor de prueba terminó antes de iniciar. ${childOutput}`);
    }
    try {
      const response = await fetch(`${baseUrl}/api/topics`);
      if (response.ok) return;
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error(`Tiempo agotado al iniciar servidor: ${String(lastError)}. ${childOutput}`);
}

async function jsonRequest(path: string, body?: unknown): Promise<{ status: number; body: any }> {
  const response = await fetch(`${baseUrl}${path}`, {
    method: body === undefined ? "GET" : "POST",
    headers: body === undefined ? undefined : { "content-type": "application/json" },
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  return { status: response.status, body: await response.json() };
}

const fullChecklist = [
  "una-idea-por-actividad", "lenguaje-6-10", "feedback-amable",
  "contexto-local-marcado", "sin-estereotipos", "sin-datos-y-seguro",
];

function draftPack(id: string) {
  return {
    packVersion: "0.1",
    id,
    title: "Paquete de prueba",
    language: "es",
    context: {
      country: "Perú",
      region: "Andes",
      communityType: "rural andina",
      foods: ["papa"],
      resources: ["agua"],
      ageRange: "6-10",
    },
    review: { status: "draft", notes: "Borrador de prueba" },
    modules: [{
      id: "modulo-prueba",
      topic: "hygiene",
      title: "Higiene",
      activities: [
        {
          id: "parejas",
          type: "match",
          prompt: "Une las parejas.",
          options: [
            { id: "agua", text: "Agua" },
            { id: "beber", text: "Beber" },
            { id: "jabon", text: "Jabón" },
            { id: "lavar", text: "Lavar" },
          ],
          correct: ["agua:beber", "jabon:lavar"],
          feedback: "¡Bien!",
          safetyTag: "hygiene",
          durationMin: 2,
        },
        {
          id: "orden",
          type: "order",
          prompt: "Ordena los pasos.",
          options: [
            { id: "mojar", text: "Mojar" },
            { id: "jabon", text: "Usar jabón" },
            { id: "enjuagar", text: "Enjuagar" },
          ],
          correct: ["mojar", "jabon", "enjuagar"],
          feedback: "¡Bien!",
          safetyTag: "hygiene",
          durationMin: 2,
        },
      ],
    }],
  };
}

before(async () => {
  dataDir = await mkdtemp(join(tmpdir(), "mochila-server-test-"));
  // A fake Gemini: answers with a valid draft and records which model was asked.
  fakeGemini = createHttpServer((request, response) => {
    fakeGeminiModel = decodeURIComponent(request.url?.match(/models\/([^:]+):/)?.[1] ?? "");
    request.resume();
    request.on("end", () => {
      response.setHeader("content-type", "application/json");
      response.end(JSON.stringify({ candidates: [{ content: { parts: [{ text: JSON.stringify(draftPack("lo-que-diga-la-ia")) }] } }] }));
    });
  });
  await new Promise<void>((resolve) => fakeGemini!.listen(0, "127.0.0.1", resolve));
  const fakePort = (fakeGemini.address() as { port: number }).port;
  const port = await freePort();
  baseUrl = `http://127.0.0.1:${port}`;
  child = spawn(process.execPath, ["--import", "tsx", "src/index.ts"], {
    cwd: serverRoot,
    env: {
      ...process.env,
      PORT: String(port),
      HOST: "127.0.0.1",
      MOCHILA_DATA_DIR: dataDir,
      GEMINI_API_KEY: "clave-de-prueba",
      GEMINI_MODEL: "modelo-de-prueba",
      GEMINI_BASE_URL: `http://127.0.0.1:${fakePort}`,
    },
    stdio: ["ignore", "pipe", "pipe"],
  });
  child.stdout?.on("data", (chunk: Buffer) => { childOutput += chunk.toString(); });
  child.stderr?.on("data", (chunk: Buffer) => { childOutput += chunk.toString(); });
  await waitForServer();
});

after(async () => {
  if (child && child.exitCode === null) {
    const exited = once(child, "exit");
    child.kill("SIGTERM");
    await exited;
  }
  if (fakeGemini) await new Promise((resolve) => fakeGemini!.close(resolve));
  if (dataDir) await rm(dataDir, { recursive: true, force: true });
});

test("validación de esquema y semántica match/order", async (t) => {
  const invalidSchema = draftPack("schema-invalido");
  invalidSchema.context.ageRange = "4-7" as "6-10";
  const schemaReply = await jsonRequest("/api/generate", { pack: invalidSchema });
  assert.equal(schemaReply.status, 422);
  assert.equal(schemaReply.body.error, "validation_failed");

  const invalidMatch = draftPack("match-invalido");
  invalidMatch.modules[0].activities[0].correct = ["agua:no-existe", "jabon:lavar"];
  const matchReply = await jsonRequest("/api/generate", { pack: invalidMatch });
  assert.equal(matchReply.status, 422);
  assert.match(JSON.stringify(matchReply.body.details), /parejas deben unir cada opción/);

  const invalidOrder = draftPack("order-invalido");
  invalidOrder.modules[0].activities[1].correct = ["mojar", "jabon"];
  const orderReply = await jsonRequest("/api/generate", { pack: invalidOrder });
  assert.equal(orderReply.status, 422);
  assert.match(JSON.stringify(orderReply.body.details), /orden correcto debe incluir cada opción/);

  const valid = await jsonRequest("/api/generate", { pack: draftPack("paquete-valido") });
  assert.equal(valid.status, 200);
  assert.equal(valid.body.pack.id, "paquete-valido");
});

test("aprobación exige reviewer entre 1 y 100 caracteres", async () => {
  const empty = await jsonRequest("/api/review/approve", { packId: "paquete-valido", reviewer: "   " });
  assert.equal(empty.status, 422);
  assert.equal(empty.body.error, "invalid_review");

  const tooLong = await jsonRequest("/api/review/approve", { packId: "paquete-valido", reviewer: "r".repeat(101) });
  assert.equal(tooLong.status, 422);
  assert.equal(tooLong.body.error, "invalid_review");
});

test("sync es idempotente al reenviar el mismo lote", async () => {
  const payload = {
    classCode: "TEST-01",
    events: [{
      eventId: "event-test-001",
      packId: "paquete-valido",
      activityId: "parejas",
      result: "correct",
      ts: "2026-11-05T10:00:00.000Z",
      avatarId: "zorro",
    }],
  };

  const first = await jsonRequest("/api/sync", payload);
  assert.equal(first.status, 200);
  assert.deepEqual(first.body, { accepted: 1, alreadyPresent: 0 });

  const second = await jsonRequest("/api/sync", payload);
  assert.equal(second.status, 200);
  assert.deepEqual(second.body, { accepted: 0, alreadyPresent: 1 });

  const progress = await jsonRequest("/api/progress/TEST-01");
  assert.equal(progress.body.eventsReceived, 1);
});

test("listado y detalle solo sirven paquetes aprobados", async () => {
  const draft = await jsonRequest("/api/generate", { pack: draftPack("solo-borrador") });
  assert.equal(draft.status, 200);

  const beforeApproval = await jsonRequest("/api/packs");
  assert.equal(beforeApproval.status, 200);
  assert.deepEqual(beforeApproval.body.packs, []);
  assert.equal((await jsonRequest("/api/packs/paquete-valido")).status, 404);
  assert.equal((await jsonRequest("/api/packs/solo-borrador")).status, 404);

  const withoutChecklist = await jsonRequest("/api/review/approve", { packId: "paquete-valido", reviewer: "Docente" });
  assert.equal(withoutChecklist.status, 422);
  assert.equal(withoutChecklist.body.error, "checklist_incomplete");
  const partial = await jsonRequest("/api/review/approve", { packId: "paquete-valido", reviewer: "Docente", checklist: fullChecklist.slice(1) });
  assert.equal(partial.status, 422);
  assert.equal((await jsonRequest("/api/packs/paquete-valido")).status, 404);

  const approval = await jsonRequest("/api/review/approve", { packId: "paquete-valido", reviewer: "Docente", checklist: fullChecklist });
  assert.equal(approval.status, 200);

  const list = await jsonRequest("/api/packs");
  assert.equal(list.status, 200);
  assert.deepEqual(list.body.packs.map((pack: { id: string }) => pack.id), ["paquete-valido"]);
  assert.match(list.body.packs[0].review.notes, /lista de revisión de 6 puntos completa/);
  assert.equal((await jsonRequest("/api/packs/paquete-valido")).status, 200);
  assert.equal((await jsonRequest("/api/packs/solo-borrador")).status, 404);
});

test("la generación con IA deja evidencia y el sello conserva modelo y fecha", async () => {
  const reply = await jsonRequest("/api/generate/ai", {
    context: { country: "Perú", region: "Andes rurales", language: "es", topic: "hygiene" },
  });
  assert.equal(reply.status, 201);
  assert.equal(reply.body.model, "modelo-de-prueba");
  assert.equal(fakeGeminiModel, "modelo-de-prueba");
  const packId = reply.body.pack.id as string;
  assert.match(reply.body.pack.review.notes, /^Generado con IA \(modelo-de-prueba, \d{4}-\d{2}-\d{2}\)/);

  const log = (await readFile(join(dataDir, "generations.jsonl"), "utf8")).trim().split("\n").map((line) => JSON.parse(line));
  const entry = log.find((item) => item.packId === packId);
  assert.ok(entry, "la generación queda registrada");
  assert.equal(entry.model, "modelo-de-prueba");
  assert.equal(entry.context.country, "Perú");
  assert.equal(entry.activities, 2);
  assert.equal(JSON.stringify(entry).includes("clave-de-prueba"), false);

  const approval = await jsonRequest("/api/review/approve", { packId, reviewer: "Docente", checklist: fullChecklist });
  assert.equal(approval.status, 200);
  const sealed = await jsonRequest(`/api/packs/${packId}`);
  assert.match(sealed.body.review.notes, /Propuesta generada con IA \(modelo-de-prueba, \d{4}-\d{2}-\d{2}\) y revisada por una persona\./);
  assert.doesNotMatch(sealed.body.review.notes, /Pendiente de revisión/);
});

test("juegos nuevos: clasificar, memoria y verdad o mentira se validan", async () => {
  const pack = draftPack("juegos-nuevos");
  pack.context.ageRange = "9-12" as "6-10";
  const games = [
    { id: "cestas", type: "sort", prompt: "Clasifica.", options: [
      { id: "antes", text: "Antes de comer" }, { id: "despues", text: "Después de comer" },
      { id: "lavar", text: "Lavarse las manos" }, { id: "poner-mesa", text: "Poner la mesa" }, { id: "recoger", text: "Recoger el plato" }],
      correct: ["lavar:antes", "poner-mesa:antes", "recoger:despues"], feedback: "¡Bien!", safetyTag: "hygiene", durationMin: 2 },
    { id: "memoria", type: "memory", prompt: "Encuentra las parejas.", options: [
      { id: "jabon", text: "Jabón" }, { id: "manos", text: "Manos" }, { id: "plato", text: "Plato" }, { id: "comida", text: "Comida" }],
      correct: ["jabon:manos", "plato:comida"], feedback: "¡Bien!", safetyTag: "none", durationMin: 2 },
    { id: "verdad", type: "truefalse", prompt: "¿Verdad o mentira?", options: [
      { id: "v1", text: "El agua limpia ayuda." }, { id: "f1", text: "Las manos sucias no importan.", feedback: "Sí importan." }],
      correct: ["v1"], feedback: "¡Bien!", safetyTag: "hygiene", durationMin: 2 },
  ];
  (pack.modules[0].activities as unknown[]).push(...games);
  const ok = await jsonRequest("/api/generate", { pack });
  assert.equal(ok.status, 200, JSON.stringify(ok.body));

  const bad = structuredClone(pack);
  bad.id = "cestas-malas";
  (bad.modules[0].activities as Array<{ id: string; correct?: string[] }>).find((a) => a.id === "cestas")!.correct = ["lavar:antes", "lavar:despues", "recoger:despues"];
  const refused = await jsonRequest("/api/generate", { pack: bad });
  assert.equal(refused.status, 422);
  assert.match(JSON.stringify(refused.body.details), /clasificar necesita/);
});

test("el panel recibe los resultados por explorador (último intento, a la primera / con ayuda / fallada)", async () => {
  const base = { packId: "paquete-valido", avatarId: "zorro", ts: "2026-11-05T10:00:00.000Z" };
  const events = [
    { ...base, eventId: "det-0001-aaaa", activityId: "parejas", result: "correct", attempts: 1 },
    { ...base, eventId: "det-0002-aaaa", activityId: "orden", result: "incorrect", attempts: 3 },
    { ...base, eventId: "det-0003-aaaa", activityId: "orden", result: "correct", attempts: 2, ts: "2026-11-05T10:05:00.000Z" },
    { ...base, eventId: "det-0004-aaaa", avatarId: "rana", activityId: "parejas", result: "incorrect", attempts: 3 },
  ];
  assert.equal((await jsonRequest("/api/sync", { classCode: "DET-01", events })).status, 200);
  const detail = await jsonRequest("/api/progress/DET-01/detail");
  assert.equal(detail.status, 200);
  const zorro = detail.body.explorers.find((item: { avatarId: string }) => item.avatarId === "zorro");
  assert.deepEqual([zorro.done, zorro.firstTry, zorro.withHelp, zorro.failed], [2, 1, 1, 0]);
  const rana = detail.body.explorers.find((item: { avatarId: string }) => item.avatarId === "rana");
  assert.deepEqual([rana.done, rana.failed], [0, 1]);
  assert.equal(zorro.results[0].packTitle, "Paquete de prueba");
});

test("un borrador pegado no puede falsificar la procedencia de la IA en el sello", async () => {
  const pack = draftPack("procedencia-falsa");
  pack.review.notes = "Generado con IA (gemini-3.5-flash, 2026-11-05). Pendiente de revisión.";
  const saved = await jsonRequest("/api/generate", { pack });
  assert.equal(saved.status, 200);
  assert.doesNotMatch(saved.body.pack.review.notes, /Generado con IA \(gemini/);
  const approval = await jsonRequest("/api/review/approve", { packId: "procedencia-falsa", reviewer: "Docente", checklist: fullChecklist });
  assert.equal(approval.status, 200);
  const sealed = await jsonRequest("/api/packs/procedencia-falsa");
  assert.doesNotMatch(sealed.body.review.notes, /gemini-3\.5-flash/);
  assert.match(sealed.body.review.notes, /IA externa \(origen sin verificar\)|generada con IA/);
});
