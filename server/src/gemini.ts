const defaultModel = "gemini-3.5-flash";
// Tried in order after the configured model when Google answers "busy" (503) or "quota" (429).
const fallbackModels = ["gemini-3.5-flash", "gemini-3.5-flash-lite", "gemini-flash-latest"];

type GeminiResponse = {
  candidates?: Array<{
    content?: { parts?: Array<{ text?: string }> };
  }>;
};

export class GeminiNotConfiguredError extends Error {
  constructor() {
    super("Gemini no está configurado en el servidor.");
    this.name = "GeminiNotConfiguredError";
  }
}

/** The provider is saturated or over quota after every retry: the teacher should use a saved draft or Plan B. */
export class GeminiBusyError extends Error {
  constructor(readonly reason: "busy" | "quota" | "network") {
    super("Gemini no está disponible ahora.");
    this.name = "GeminiBusyError";
  }
}

export class GeminiKeyError extends Error {
  constructor() {
    super("Google rechazó la clave de Gemini.");
    this.name = "GeminiKeyError";
  }
}

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callModel(model: string, apiKey: string, prompt: string): Promise<Response> {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  return fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": apiKey },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        responseFormat: { text: { mimeType: "APPLICATION_JSON" } },
        maxOutputTokens: 8000,
        temperature: 0.5,
      },
    }),
    signal: AbortSignal.timeout(50_000),
  });
}

/** Pulls the JSON object out of the model's text, tolerating Markdown fences or a sentence around it. */
function parseJsonText(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  try {
    return JSON.parse(cleaned);
  } catch {
    const start = cleaned.indexOf("{");
    const end = cleaned.lastIndexOf("}");
    if (start >= 0 && end > start) return JSON.parse(cleaned.slice(start, end + 1));
    throw new Error("sin JSON");
  }
}

/**
 * Returns the parsed JSON and the model that actually answered (it may be a fallback model).
 * A model that is busy, out of quota, unknown, slow, answers an error or returns unreadable JSON never
 * ends the attempt: the next model is tried. Only a rejected key (401/403) stops it, with its own message.
 */
export async function generateJsonWithGemini(prompt: string): Promise<{ data: unknown; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new GeminiNotConfiguredError();

  const configured = process.env.GEMINI_MODEL?.trim() || defaultModel;
  const models = [configured, ...fallbackModels.filter((model) => model !== configured)];
  let lastReason: "busy" | "quota" | "network" = "busy";
  const deadline = Date.now() + 170_000; // the teacher waits at most about three minutes in total
  const slow = new Set<string>(); // models that did not answer in time are not tried again
  let tries = 0;

  // Google's models are often «high demand» for a few seconds: go round the list up to three times.
  for (let round = 0; round < 3; round++) {
  for (const model of models) {
    if (Date.now() > deadline) break;
    if (slow.has(model)) continue;
    if (tries++ > 0) await wait(round === 0 ? 800 : 4000); // short backoff between attempts
    let response: Response;
    try {
      response = await callModel(model, apiKey, prompt);
    } catch {
      lastReason = "network";
      slow.add(model);
      console.warn(`Gemini ${model}: sin respuesta a tiempo, probando el siguiente modelo`);
      continue;
    }
    if (response.status === 401 || response.status === 403) throw new GeminiKeyError();
    if (!response.ok) {
      lastReason = response.status === 429 ? "quota" : response.status >= 500 ? "busy" : lastReason;
      console.warn(`Gemini ${model}: ${response.status}, probando el siguiente modelo`);
      continue;
    }
    let text: string | undefined;
    try {
      const result = (await response.json()) as GeminiResponse;
      text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    } catch {
      text = undefined;
    }
    if (!text) {
      console.warn(`Gemini ${model}: respuesta vacía, probando el siguiente modelo`);
      continue;
    }
    try {
      return { data: parseJsonText(text), model };
    } catch {
      console.warn(`Gemini ${model}: JSON no legible, probando el siguiente modelo`);
    }
  }
  }
  throw new GeminiBusyError(lastReason);
}
