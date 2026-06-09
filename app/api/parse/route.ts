import { createAIRoute } from "@/lib/api/route-factory";
import { parseNaturalLanguage } from "@/lib/agents/orchestrator";
import { parseInputSchema } from "@/lib/schema";
import { parseFallback } from "@/lib/agents/fallback-parser";
import type { ParseResult } from "@/lib/agents/orchestrator";

export const POST = createAIRoute<
  { input: string; region?: string },
  ParseResult
>({
  schema: parseInputSchema,
  cachePrefix: "parse",
  cacheKeyFn: (input) => ({ input: input.input, region: input.region }),
  handler: async (input) => parseNaturalLanguage(input.input, input.region),
  fallbackHandler: (input) => parseFallback(input.input),
  responseFn: (category) => category as Record<string, unknown>,
});
