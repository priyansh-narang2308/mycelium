import { NextResponse } from "next/server";
import { parseNaturalLanguage } from "../../../lib/agents/orchestrator";
import { parseInputSchema } from "../../../lib/schema";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = parseInputSchema.parse(body);
    const apiKeyOverride = req.headers.get("x-api-key") || undefined;

    const parsed = await parseNaturalLanguage(validatedData.input, apiKeyOverride);
    return NextResponse.json(parsed);
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid input data provided." }, { status: 400 });
    }
    return NextResponse.json({ error: "An unexpected error occurred during processing." }, { status: 500 });
  }
}
