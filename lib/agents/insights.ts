import { getAIClient } from "@/lib/agents/client";
import { Activity } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";

export async function generateInsight(
  history: Activity[],
  budget: number,
  region?: string,
): Promise<string> {
  const ai = getAIClient();

  const todayEmissions = history.reduce((sum, a) => sum + a.co2e, 0);
  const percentage = Math.round((todayEmissions / budget) * 100);

  const regionContext = region
    ? `\nUser's Region: ${getRegionLabel(region)} — mention how their local context affects their footprint.`
    : "";

  const prompt = `
You are an encouraging, data-driven Climate Coach.
The user has consumed ${percentage}% of their ${budget}kg daily carbon budget (${todayEmissions.toFixed(1)} kg CO2e used).${regionContext}

Generate a single, powerful "aha" moment sentence.
Rules:
1. Keep it under 15 words.
2. If they are over budget, be encouraging and future-focused, not shameful.
3. If they are under budget, praise their specific efficiency.
4. Do NOT use markdown, emojis, or hashtags.
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    return response.text || "";
  } catch {
    return "";
  }
}
