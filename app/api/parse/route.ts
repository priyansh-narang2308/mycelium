import { NextResponse } from "next/server";
import { parseNaturalLanguage } from "../../../lib/agents/orchestrator";

export async function POST(req: Request) {
  try {
    const { input } = await req.json();
    const apiKeyOverride = req.headers.get("x-api-key") || undefined;

    if (!input) {
      return NextResponse.json({ error: "Missing input field" }, { status: 400 });
    }

    const parsed = await parseNaturalLanguage(input, apiKeyOverride);
    return NextResponse.json(parsed);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Parse API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to parse input" }, { status: 500 });
  }
}
