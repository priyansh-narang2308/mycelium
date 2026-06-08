import { NextResponse } from "next/server";
import { generateInsight } from "../../../lib/agents/insights";

export async function POST(req: Request) {
  try {
    const { history, budget } = await req.json();
    const apiKeyOverride = req.headers.get("x-api-key") || undefined;

    if (!history || budget === undefined) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const insight = await generateInsight(history, budget, apiKeyOverride);
    return NextResponse.json({ insight });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Insight API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate insight" }, { status: 500 });
  }
}
