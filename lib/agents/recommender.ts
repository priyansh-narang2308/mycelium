import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { Activity, Recommendation } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";
import { recommendationArraySchema } from "@/lib/schemas/recommend";
import { buildRecommendPrompt } from "./prompts/recommend.prompt";

export async function getRecommendations(
  activities: Activity[],
  region?: string,
): Promise<Recommendation[]> {
  if (activities.length === 0) return [];

  const ai = getAIClient();

  const recentActivities = activities.slice(-30);
  const activitiesContext = recentActivities
    .map((a) => `${a.amount}${a.unit} of ${a.subCategory} (${a.co2e}kg CO2)`)
    .join("\n");

  const regionContext = region
    ? `\nUser's Region: ${getRegionLabel(region)} — factor this into your recommendations (e.g., grid mix, transit availability, local food systems).`
    : "";

  const prompt = buildRecommendPrompt(activitiesContext, regionContext);

  const text = await generateContentSafe(ai, prompt);
  if (!text) return [];

  try {
    const parsed = JSON.parse(text);
    const result = recommendationArraySchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    return [];
  } catch {
    return [];
  }
}
