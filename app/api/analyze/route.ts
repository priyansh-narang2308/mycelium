import { NextResponse } from "next/server";
import { processUserLog } from "../../../lib/agents/orchestrator";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { input, history, budget } = body;

    if (!input || !history) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await processUserLog(input, history, budget || 10);

    return NextResponse.json(result);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API Analyze Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to process activity" },
      { status: 500 },
    );
  }
}
