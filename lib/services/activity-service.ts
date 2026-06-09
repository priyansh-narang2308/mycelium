import type { Activity, Recommendation } from "@/lib/types";
import { calculateActivityEmissions } from "@/lib/agents/calculator";

interface ParseResult {
  category: string;
  subCategory: string;
  amount: number;
}

export async function parseActivity(input: string, region: string): Promise<ParseResult> {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ input, region }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to parse input");
  }
  return res.json();
}

export function buildActivity(rawInput: string, parsed: ParseResult, region: string): Activity {
  const data = calculateActivityEmissions(parsed.category, parsed.subCategory, parsed.amount, rawInput, region);
  return { id: Date.now().toString(), timestamp: new Date().toISOString(), ...data };
}

export async function fetchAIFeedback(
  history: Activity[],
  region: string,
  budget: number,
  onRecommendations: (recs: Recommendation[]) => void,
  onInsight: (insight: string) => void,
): Promise<void> {
  try {
    const [recRes, insRes] = await Promise.all([
      fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, region }),
      }),
      fetch("/api/insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ history, budget, region }),
      }),
    ]);
    if (recRes.ok) {
      const data = await recRes.json();
      if (data.recommendations?.length) onRecommendations(data.recommendations);
    }
    if (insRes.ok) {
      const data = await insRes.json();
      if (data.insight) onInsight(data.insight);
    }
  } catch {
  }
}

export function getDefaultHeaders(): Record<string, string> {
  return { "Content-Type": "application/json" };
}
