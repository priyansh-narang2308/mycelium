import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { Activity, Recommendation } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";
import { z } from "zod";
import { recommendationSchema } from "@/lib/schema";

const recommendationArraySchema = z.array(recommendationSchema);


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

  const prompt = `
You are an expert Behavioral Psychologist and Environmental Scientist.
Analyze the user's recent carbon-emitting activities and generate exactly 3 high-leverage lifestyle swaps.${regionContext}

Rules:
1. Focus ONLY on their highest-emitting activities from the provided history.
2. Recommendations must be highly specific, practical, and non-judgmental. Do not give generic advice like "drive less".
3. Use behavioral nudges: emphasize what they gain (e.g. "save money", "feel healthier") rather than what they lose.
4. Calculate a realistic estimated annual savings in kg CO2e if they adopt this swap.

Return ONLY a valid JSON array of objects with this exact structure, with no markdown formatting:
[
  {
    "id": "unique-string",
    "title": "Catchy, Action-Oriented Title",
    "description": "Specific, actionable steps to make the swap and why it works.",
    "potentialSavings": 150,
    "difficulty": "Easy"
  }
]

User Activities:
${activitiesContext}
  `;

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
