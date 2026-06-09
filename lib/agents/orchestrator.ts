import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { getRegionLabel } from "@/lib/emissions";
import { parseOutputSchema } from "@/lib/schema";
import { buildParsePrompt } from "./prompts/parse.prompt";

export interface ParseResult {
  category?: string;
  subCategory?: string;
  amount?: number;
}


/**
 * Parses natural language input into structured activity data using AI.
 * Falls back to keyword-based parsing if AI fails or returns invalid data.
 * @param input - User's natural language description (e.g., "drove 10km")
 * @param region - Optional region for context-aware parsing
 * @returns Parsed activity with category, subCategory, and amount
 */
export async function parseNaturalLanguage(
  input: string,
  region?: string,
): Promise<ParseResult> {
  const ai = getAIClient();

  const regionContext = region
    ? `User's Region: ${getRegionLabel(region)}`
    : "";

  const prompt = buildParsePrompt(input, regionContext);

  const text = await generateContentSafe(ai, prompt);
  if (!text) return {};

  try {
    const parsed = JSON.parse(text);
    const result = parseOutputSchema.safeParse(parsed);
    if (result.success) {
      return result.data;
    }
    return {};
  } catch {
    return {};
  }
}