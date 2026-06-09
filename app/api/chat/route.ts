import { NextResponse } from "next/server";
import { getAIClient } from "@/lib/agents/client";
import { chatSchema } from "@/lib/schema";
import { z } from "zod";
import { aiCache } from "@/lib/cache";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validatedData = chatSchema.parse(body);


    const cacheKey = aiCache.generateKey("chat", {
      message: validatedData.message,
      history: validatedData.history,
    });
    const cached = aiCache.get(cacheKey);
    if (cached) return NextResponse.json({ response: cached });

    const ai = getAIClient();

    const recentActivities = validatedData.history.slice(-30);
    const activitiesContext =
      recentActivities.length > 0
        ? recentActivities
            .map(
              (a) =>
                `${a.amount}${a.unit} of ${a.subCategory} (${a.co2e}kg CO₂ — ${a.equivalent})`,
            )
            .join("\n")
        : "No activities logged yet.";

    const totalEmissions = validatedData.history.reduce(
      (sum, a) => sum + a.co2e,
      0,
    );

    const prompt = `
You are CarbonKeeper's AI Climate Assistant. You help users understand their carbon footprint data.

The user has logged the following activities (showing up to 30 most recent):
${activitiesContext}

Total logged emissions: ${totalEmissions.toFixed(1)} kg CO₂e across ${validatedData.history.length} activities.

Rules:
1. Only reference data from the provided activities. Never fabricate numbers.
2. Be encouraging, specific, and non-judgmental.
3. Keep responses concise — under 150 words.
4. If asked about something not in their data, politely say you can only answer based on their logged activities.
5. Do not use markdown, emojis, or hashtags.

User's question: ${validatedData.message}
`;

    const response = await ai.models.generateContent({
      model: "gemini-flash-latest",
      contents: prompt,
    });

    const text = response.text || "";
    if (text) {
      aiCache.set(cacheKey, text);
    }
    return NextResponse.json({ response: text });
  } catch (error: unknown) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: "Invalid chat data provided." },
        { status: 400 },
      );
    }
    console.error("Chat API error:", error);
    return NextResponse.json(
      { response: "I'm having trouble connecting right now due to server limits. Please try again in a few moments!" },
      { status: 200 },
    );
  }
}
