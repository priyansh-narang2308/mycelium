import { GoogleGenAI } from "@google/genai";

export const getAIClient = (apiKeyOverride?: string) => {
  return new GoogleGenAI({
    apiKey: apiKeyOverride || process.env.GEMINI_API_KEY,
  });
};

export async function generateContentSafe(
  ai: GoogleGenAI,
  prompt: string,
): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });
    return response.text || null;
  } catch {
    return null;
  }
}

export async function generateTextSafe(
  ai: GoogleGenAI,
  prompt: string,
): Promise<string | null> {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });
    return response.text || null;
  } catch {
    return null;
  }
}
