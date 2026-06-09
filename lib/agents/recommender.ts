import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { Activity, Recommendation } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";
import { z } from "zod";
import { recommendationSchema } from "@/lib/schema";
import { buildRecommendPrompt } from "./prompts/recommend.prompt";

const recommendationArraySchema = z.array(recommendationSchema);


/**
 * Generates personalized carbon reduction recommendations based on user's activity history.
 * @param activities - Array of logged activities (most recent 30 used)
 * @param region - Optional region for grid-specific recommendations
 * @returns Array of up to 3 high-leverage lifestyle swap recommendations
 */
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