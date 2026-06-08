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
You are a Carbon Insights Agent.
Generate a single, encouraging "aha" moment sentence for the user.
They have used ${percentage}% of their daily carbon budget today (${todayEmissions.toFixed(1)} kg CO2e).
Keep it under 15 words, non-judgmental, and specific. Do NOT use markdown.
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
