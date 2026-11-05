const defaultModel = "gemini-3.5-flash";
// Tried in order after the configured model when Google answers "busy" (503) or "quota" (429).
const fallbackModels = ["gemini-3.5-flash", "gemini-flash-latest", "gemini-3.5-flash-lite"];

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

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function callModel(model: string, apiKey: string, prompt: string): Promise<Response> {
  // GEMINI_BASE_URL only exists so the tests can use a fake Gemini; in production it is always Google's.
  const base = process.env.GEMINI_BASE_URL?.trim() || "https://generativelanguage.googleapis.com/v1beta";
  const endpoint = `${base}/models/${encodeURIComponent(model)}:generateContent`;
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
    signal: AbortSignal.timeout(60_000),
  });
}

/** Returns the parsed JSON and the model that actually answered (it may be a fallback model). */
export async function generateJsonWithGemini(prompt: string): Promise<{ data: unknown; model: string }> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new GeminiNotConfiguredError();

  const configured = process.env.GEMINI_MODEL?.trim() || defaultModel;
  const models = [configured, ...fallbackModels.filter((model) => model !== configured)];
  let lastReason: "busy" | "quota" | "network" = "busy";

  for (const [attempt, model] of models.entries()) {
    if (attempt > 0) await wait(800 * attempt); // short backoff between attempts
    let response: Response;
    try {
      response = await callModel(model, apiKey, prompt);
    } catch {
      lastReason = "network";
      continue;
    }
    if (response.status === 503 || response.status === 429) {
      lastReason = response.status === 429 ? "quota" : "busy";
      console.warn(`Gemini ${model}: ${response.status}, probando el siguiente modelo`);
      continue;
    }
    if (response.status === 404) continue; // model not available for this key
    if (!response.ok) throw new Error("Gemini rechazó la solicitud.");
    const result = (await response.json()) as GeminiResponse;
    const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
    if (!text) throw new Error("Gemini no devolvió contenido JSON.");
    try {
      return { data: JSON.parse(text) as unknown, model };
    } catch {
      throw new Error("Gemini devolvió JSON no válido.");
    }
  }
  throw new GeminiBusyError(lastReason);
}
