import { GoogleGenAI } from "@google/genai";
import { Activity, Recommendation } from "../types";

export async function getRecommendations(
  activities: Activity[],
  apiKeyOverride?: string,
): Promise<Recommendation[]> {
  if (activities.length === 0) return [];

  const ai = new GoogleGenAI({
    apiKey: apiKeyOverride || process.env.GEMINI_API_KEY,
  });

  const activitiesContext = activities
    .map((a) => `${a.amount}${a.unit} of ${a.subCategory} (${a.co2e}kg CO2)`)
    .join("\n");

  const prompt = `
You are an expert Behavioral Psychologist and Environmental Scientist.
Analyze the user's recent carbon-emitting activities and generate exactly 3 high-leverage lifestyle swaps.

Rules:
1. Focus ONLY on their highest-emitting activities from the provided history.
2. Recommendations must be highly specific, practical, and non-judgmental. Do not give generic advice like "drive less".
3. Use behavioral nudges: emphasize what they gain (e.g. "save money", "feel healthier") rather than what they lose.
4. Calculate a realistic estimated annual savings in kg CO2e if they adopt this swap.

Return ONLY a valid JSON array of objects with this exact structure, with no markdown formatting:
[
  {
    "id": "unique-string",
    "title": "Catchy, Action-Oriented Title",
    "description": "Specific, actionable steps to make the swap and why it works.",
    "potentialSavings": 150, // estimated kg CO2e saved per year
    "difficulty": "Easy" // "Easy", "Medium", or "Hard"
  }
]

User Activities:
${activitiesContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    if (!response.text) return [];
    return JSON.parse(response.text) as Recommendation[];
  } catch (error) {
    console.error("Recommender Agent Error:", error);
    return [];
  }
}
