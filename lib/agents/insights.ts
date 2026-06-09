import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { Activity } from "@/lib/types";
import { getRegionLabel } from "@/lib/emissions";
import { buildInsightPrompt } from "./prompts/insight.prompt";

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
