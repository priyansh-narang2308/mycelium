import { getAIClient, generateContentSafe } from "@/lib/agents/client";
import { getRegionLabel } from "@/lib/emissions";
import { parseOutputSchema } from "@/lib/schemas/parse";
import { buildParsePrompt } from "./prompts/parse.prompt";

export interface ParseResult {
  category?: string;
  subCategory?: string;
  amount?: number;
}

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
