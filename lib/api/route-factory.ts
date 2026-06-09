import { NextResponse } from "next/server";
import { z } from "zod";
import { aiCache } from "@/lib/cache";

interface AIHandlerOptions<TInput, TOutput> {
  schema: z.ZodSchema<TInput>;
  cachePrefix: string;
  cacheKeyFn: (input: TInput) => Record<string, unknown>;
  handler: (input: TInput, apiKey?: string) => Promise<TOutput | null | undefined>;
  responseFn: (output: TOutput | null | undefined) => Record<string, unknown>;
}

export function createAIRoute<TInput, TOutput>(
  options: AIHandlerOptions<TInput, TOutput>,
) {
  return async function POST(req: Request): Promise<NextResponse> {
    try {
      const body = await req.json();
      const validatedInput = options.schema.parse(body);
      const apiKeyOverride = req.headers.get("x-api-key") || undefined;

      const cacheKey = aiCache.generateKey(
        options.cachePrefix,
        options.cacheKeyFn(validatedInput),
      );
      const cached = aiCache.get(cacheKey) as TOutput | null | undefined;
      if (cached !== null && cached !== undefined) {
        return NextResponse.json(options.responseFn(cached));
      }

      const output = await options.handler(validatedInput, apiKeyOverride);

      if (output !== null && output !== undefined && output !== "") {
        aiCache.set(cacheKey, output);
      }

      return NextResponse.json(options.responseFn(output));
    } catch (error: unknown) {
      if (error instanceof z.ZodError) {
        return NextResponse.json(
          { error: "Invalid input data provided." },
          { status: 400 },
        );
      }
      return NextResponse.json(
        { error: "An unexpected error occurred during processing." },
        { status: 500 },
      );
    }
  };
}