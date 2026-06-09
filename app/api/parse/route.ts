import { NextResponse } from "next/server";
import { parseNaturalLanguage } from "@/lib/agents/orchestrator";
import { parseInputSchema } from "@/lib/schema";
import { z } from "zod";
import { parseFallback } from "@/lib/agents/fallback-parser";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = parseInputSchema.parse(body);


    const parsed = await parseNaturalLanguage(
      validatedData.input,
      validatedData.region,
    );

    const category =
      parsed.category && parsed.subCategory && parsed.amount !== undefined
        ? parsed
        : parseFallback(validatedData.input);

    if (!category.category || !category.subCategory || category.amount === undefined) {
      return NextResponse.json(
        { error: "Could not understand input. Try something like 'drove 10km' or 'ate beef for dinner'." },
        { status: 422 },
      );
    }

    return NextResponse.json(category);
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
}
