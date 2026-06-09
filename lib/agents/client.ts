import { GoogleGenAI } from "@google/genai";

export const getAIClient = () => {
  return new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
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
