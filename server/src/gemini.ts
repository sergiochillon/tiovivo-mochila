const defaultModel = "gemini-3.8-flash";

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

export async function generateJsonWithGemini(prompt: string): Promise<unknown> {
  const apiKey = process.env.GEMINI_API_KEY?.trim();
  if (!apiKey) throw new GeminiNotConfiguredError();

  const model = process.env.GEMINI_MODEL?.trim() || defaultModel;
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(model)}:generateContent`;
  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-goog-api-key": apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          responseFormat: { text: { mimeType: "APPLICATION_JSON" } },
          maxOutputTokens: 6000,
          temperature: 0.3,
        },
      }),
      signal: AbortSignal.timeout(60_000),
    });
  } catch {
    throw new Error("No se pudo contactar con Gemini.");
  }

  if (!response.ok) throw new Error("Gemini rechazó la solicitud.");
  const result = (await response.json()) as GeminiResponse;
  const text = result.candidates?.[0]?.content?.parts?.map((part) => part.text ?? "").join("").trim();
  if (!text) throw new Error("Gemini no devolvió contenido JSON.");
  try {
    return JSON.parse(text) as unknown;
  } catch {
    throw new Error("Gemini devolvió JSON no válido.");
  }
}
