import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { Activity } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";
import { buildInsightPrompt } from "./prompts/insight.prompt";

/**
 * Generates a single-sentence "aha moment" insight based on user's daily carbon budget usage.
 * @param history - Array of logged activities
 * @param budget - Daily carbon budget in kg CO2e
 * @param region - Optional region for context-aware insight
 * @returns Encouraging insight sentence under 15 words
 */
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

  const prompt = buildInsightPrompt(percentage, budget, todayEmissions, regionContext);

  try {
    const response = await generateContentSafe(ai, prompt);
    return response || "";
  } catch {
    return "";
  }
}