import { NextResponse } from "next/server";
import { getRecommendations } from "@/lib/agents/recommender";
import { recommendSchema } from "@/lib/schema";
import { z } from "zod";
import { aiCache } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = recommendSchema.parse(body);


    const cacheKey = aiCache.generateKey("rec", { history: validatedData.history, region: validatedData.region });
    const cached = aiCache.get(cacheKey);
    if (cached) return NextResponse.json({ recommendations: cached });

    const recommendations = await getRecommendations(
      validatedData.history,
      validatedData.region,
    );
    
    if (recommendations.length > 0) {
      aiCache.set(cacheKey, recommendations);
    }
    return NextResponse.json({ recommendations });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid history data provided." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        error: "An unexpected error occurred during recommendation generation.",
      },
      { status: 500 },
    );
  }
}
