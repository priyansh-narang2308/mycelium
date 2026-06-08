import { NextResponse } from "next/server";
import { getRecommendations } from "../../../lib/agents/recommender";

export async function POST(req: Request) {
  try {
    const { history } = await req.json();
    const apiKeyOverride = req.headers.get("x-api-key") || undefined;

    if (!history) {
      return NextResponse.json({ error: "Missing history field" }, { status: 400 });
    }

    const recommendations = await getRecommendations(history, apiKeyOverride);
    return NextResponse.json({ recommendations });
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Recommend API Error:", error);
    return NextResponse.json({ error: error.message || "Failed to generate recommendations" }, { status: 500 });
  }
}
