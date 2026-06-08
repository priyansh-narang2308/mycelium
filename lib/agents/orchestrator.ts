import { GoogleGenAI } from '@google/genai';
import { calculateActivityEmissions } from './calculator';
import { getRecommendations } from './recommender';
import { generateInsight } from './insights';
import { Activity } from '../types';

export async function parseNaturalLanguage(input: string) {
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
Extract category, subCategory, and amount from: "${input}"
Categories: transport, food, energy, shopping
Subcategories mapping:
- transport: car, flight, bus, train, bike
- food: beef, chicken, pork, vegetables, rice
- energy: grid_avg, solar
- shopping: new_laptop, tshirt, jeans

Return ONLY JSON: {"category": "transport", "subCategory": "car", "amount": 12}
`;
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash',
    contents: prompt,
    config: { responseMimeType: 'application/json' }
  });
  return JSON.parse(response.text || '{}');
}

export async function processUserLog(
  input: { raw?: string; category?: string; subCategory?: string; amount?: number },
  history: Activity[],
  budget: number
) {
  let cat = input.category;
  let subCat = input.subCategory;
  let amt = input.amount;

  // 1. If natural language, parse it first
  if (input.raw && (!cat || !subCat || !amt)) {
    const parsed = await parseNaturalLanguage(input.raw);
    cat = parsed.category;
    subCat = parsed.subCategory;
    amt = parsed.amount;
  }

  if (!cat || !subCat || amt === undefined) {
    throw new Error("Invalid input data");
  }

  // 2. Calculator Subagent (Synchronous)
  const newActivityData = calculateActivityEmissions(cat, subCat, amt, input.raw);
  
  const newActivity: Activity = {
    id: Date.now().toString(),
    timestamp: new Date().toISOString(),
    ...newActivityData
  };

  const updatedHistory = [...history, newActivity];

  // 3. Parallel Execution: Recommender & Insights
  const [recommendations, insight] = await Promise.all([
    getRecommendations(updatedHistory),
    generateInsight(updatedHistory, budget)
  ]);

  return {
    activity: newActivity,
    recommendations,
    insight
  };
}
