import { GoogleGenAI } from "@google/genai";

export async function parseNaturalLanguage(
  input: string,
  apiKeyOverride?: string,
) {
  const ai = new GoogleGenAI({
    apiKey: apiKeyOverride || process.env.GEMINI_API_KEY,
  });
  const prompt = `
You are an expert NLP Parser for a Carbon Footprint tracker.
Your task is to analyze the user's natural language input and extract the precise entity parameters.
Inputs may be messy, colloquial, or missing context.

Categories & Subcategories:
- transport: car, flight, bus, train, bike
- food: beef, chicken, pork, vegetables, rice
- energy: grid_avg, solar
- shopping: new_laptop, tshirt, jeans

Rules:
1. If the unit is missing, assume logical defaults (e.g., driving = km, food = kg).
2. If the user mentions a specific food but it's not listed, map it to the closest subcategory (e.g. "steak" -> "beef", "carrot" -> "vegetables").
3. If the input is completely unrecognizable, map category to "transport", subCategory to "car", and amount to 0.

Return ONLY a JSON object with this exact structure, with no markdown formatting:
{
  "category": "string",
  "subCategory": "string",
  "amount": number
}

Input: "${input}"
`;
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash",
    contents: prompt,
    config: { responseMimeType: "application/json" },
  });
  try {
    return JSON.parse(response.text || "{}");
  } catch {
    return {};
  }
}
