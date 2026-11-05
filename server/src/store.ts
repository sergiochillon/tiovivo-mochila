import { appendFile, mkdir, readFile, rename, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

export type Pack = {
  id: string;
  review: { status: "draft" | "approved"; [key: string]: unknown };
  [key: string]: unknown;
};

export type ProgressEvent = {
  eventId: string;
  packId: string;
  activityId: string;
  result: "completed" | "correct" | "incorrect" | "skipped";
  ts: string;
  avatarId: string;
  attempts?: number;
  type?: "activity_completed";
  classCode?: string;
};

export type StoredEvent = { classCode: string; event: ProgressEvent };

export type StoreState = {
  version: 1;
  packs: Map<string, Pack>;
  events: Map<string, StoredEvent>;
};

const dataDir = process.env.MOCHILA_DATA_DIR
  ? resolve(process.env.MOCHILA_DATA_DIR)
  : resolve(dirname(fileURLToPath(import.meta.url)), "../data");
const storePath = resolve(dataDir, "store.json");

/** One line per real AI generation (append-only evidence): when, which model, which draft and context.
 *  Never the prompt, the API key or anything about children. Ignored by Git like store.json. */
export type GenerationRecord = {
  at: string;
  model: string;
  packId: string;
  context: { country: string; region: string; language: string; topic: string };
  activities: number;
};
export async function logGeneration(record: GenerationRecord): Promise<void> {
  await mkdir(dataDir, { recursive: true });
  await appendFile(resolve(dataDir, "generations.jsonl"), JSON.stringify(record) + "\n", "utf8");
}

const emptyState = (): StoreState => ({ version: 1, packs: new Map(), events: new Map() });
const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

async function loadState(): Promise<StoreState> {
  await mkdir(dataDir, { recursive: true });
  try {
    const raw = await readFile(storePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    if (
      !isRecord(parsed) ||
      parsed.version !== 1 ||
      !isRecord(parsed.packs) ||
      !isRecord(parsed.events)
    ) {
      throw new Error("Formato de almacenamiento incompatible");
    }
    return {
      version: 1,
      packs: new Map(Object.entries(parsed.packs) as Array<[string, Pack]>),
      events: new Map(Object.entries(parsed.events) as Array<[string, StoredEvent]>),
    };
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return emptyState();
    throw error;
  }
}

let state = await loadState();
let writeQueue: Promise<void> = Promise.resolve();

async function persist(next: StoreState): Promise<void> {
  const temporaryPath = `${storePath}.${process.pid}.tmp`;
  const serializable = {
    version: next.version,
    packs: Object.fromEntries(next.packs),
    events: Object.fromEntries(next.events),
  };
  await writeFile(temporaryPath, `${JSON.stringify(serializable, null, 2)}\n`, "utf8");
  await rename(temporaryPath, storePath);
}

export async function snapshot(): Promise<StoreState> {
  await writeQueue;
  return structuredClone(state);
}

export function transact<T>(
  update: (draft: StoreState) => { value: T; changed: boolean },
): Promise<T> {
  const operation = writeQueue.then(async () => {
    const draft = structuredClone(state);
    const result = update(draft);
    if (result.changed) {
      await persist(draft);
      state = draft;
    }
    return result.value;
  });
  writeQueue = operation.then(
    () => undefined,
    () => undefined,
  );
  return operation;
}
