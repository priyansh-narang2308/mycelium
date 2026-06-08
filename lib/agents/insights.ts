import { GoogleGenAI } from "@google/genai";
import { Activity } from "../types";

export async function generateInsight(
  history: Activity[],
  budget: number,
  apiKeyOverride?: string,
): Promise<string> {
  const ai = new GoogleGenAI({
    apiKey: apiKeyOverride || process.env.GEMINI_API_KEY,
  });

  const todayEmissions = history.reduce((sum, a) => sum + a.co2e, 0);
  const percentage = Math.round((todayEmissions / budget) * 100);

  const prompt = `
You are an encouraging, data-driven Climate Coach.
The user has consumed ${percentage}% of their ${budget}kg daily carbon budget (${todayEmissions.toFixed(1)} kg CO2e used).

Generate a single, powerful "aha" moment sentence.
Rules:
1. Keep it under 15 words.
2. If they are over budget, be encouraging and future-focused, not shameful.
3. If they are under budget, praise their specific efficiency.
4. Do NOT use markdown, emojis, or hashtags.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    return response.text || "Every small step counts towards a greener future.";
  } catch {
    return "Keep up the great work tracking your footprint!";
  }
}
