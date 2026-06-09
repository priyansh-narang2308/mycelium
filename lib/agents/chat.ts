import { getAIClient } from "@/lib/agents/client";
import type { Activity } from "@/lib/types";

export async function generateChatResponse(
  message: string,
  history: Activity[],
  apiKeyOverride?: string,
): Promise<string> {
  const ai = getAIClient(apiKeyOverride);

  const recentActivities = history.slice(-30);
  const activitiesContext =
    recentActivities.length > 0
      ? recentActivities
          .map(
            (a) =>
              `${a.amount}${a.unit} of ${a.subCategory} (${a.co2e}kg CO₂ — ${a.equivalent})`,
          )
          .join("\n")
      : "No activities logged yet.";

  const totalEmissions = history.reduce((sum, a) => sum + a.co2e, 0);

  const prompt = `
You are CarbonKeeper's AI Climate Assistant. You help users understand their carbon footprint data.

The user has logged the following activities (showing up to 30 most recent):
${activitiesContext}

Total logged emissions: ${totalEmissions.toFixed(1)} kg CO₂e across ${history.length} activities.

Rules:
1. Only reference data from the provided activities. Never fabricate numbers.
2. Be encouraging, specific, and non-judgmental.
3. Keep responses concise — under 150 words.
4. If asked about something not in their data, politely say you can only answer based on their logged activities.
5. Do not use markdown, emojis, or hashtags.

User's question: ${message}
`.trim();

  const response = await ai.models.generateContent({
    model: "gemini-flash-latest",
    contents: prompt,
  });

  return response.text || "";
}
