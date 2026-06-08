import { GoogleGenAI } from '@google/genai';
import { Activity, Recommendation } from '../types';

export async function getRecommendations(activities: Activity[], apiKeyOverride?: string): Promise<Recommendation[]> {
  if (activities.length === 0) return [];
  
  const ai = new GoogleGenAI({ apiKey: apiKeyOverride || process.env.GEMINI_API_KEY });
  
  const activitiesContext = activities.map(a => `${a.amount}${a.unit} of ${a.subCategory} (${a.co2e}kg CO2)`).join('\n');
  
  const prompt = `
You are a Carbon Footprint Recommender Agent.
Based on the user's recent activities, suggest exactly 3 high-impact, personalized lifestyle swaps.
Focus on the activities with the highest CO2 footprint.
Return ONLY a valid JSON array of objects with this exact structure:
[
  {
    "id": "unique-string",
    "title": "Short title",
    "description": "Why this swap matters and how to do it",
    "potentialSavings": 150, // number, estimated kg CO2e saved per year
    "difficulty": "Easy" // "Easy", "Medium", or "Hard"
  }
]

User Activities:
${activitiesContext}
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });
    
    if (!response.text) return [];
    return JSON.parse(response.text) as Recommendation[];
  } catch (error) {
    console.error("Recommender Agent Error:", error);
    return [];
  }
}
