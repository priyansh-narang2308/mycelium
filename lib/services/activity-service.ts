import type { Activity, Recommendation } from "@/lib/types";
import { calculateActivityEmissions } from "@/lib/agents/calculator";
import type { ParseResult } from "@/lib/agents/orchestrator";

export interface LogActivityDeps {
  region: string;
  dailyBudget: number;
  activities: Activity[];
  addActivity: (activity: Activity) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setInsight: (insight: string) => void;
}

export interface AIFeedbackResult {
  recommendationsUpdated: boolean;
  insightUpdated: boolean;
  error?: string;
}

export async function logActivityWithDeps(
  input: string,
  deps: LogActivityDeps,
): Promise<void> {
  const parsed = await parseActivity(input, deps.region);
  const activity = buildActivity(input, parsed, deps.region);

  deps.addActivity(activity);

  const updatedHistory = [...deps.activities, activity];
  void fetchAIFeedback(
    updatedHistory,
    deps.region,
    deps.dailyBudget,
    deps.setRecommendations,
    deps.setInsight,
  );
}

export async function parseActivity(
  input: string,
  region: string,
): Promise<ParseResult> {
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

export function buildActivity(
  rawInput: string,
  parsed: ParseResult,
  region: string,
): Activity {
  const data = calculateActivityEmissions(
    parsed.category ?? "transport",
    parsed.subCategory ?? "car",
    parsed.amount ?? 1,
    rawInput,
    region,
  );
  return {
    id: crypto.randomUUID(),
    timestamp: new Date().toISOString(),
    ...data,
  };
}

export async function fetchAIFeedback(
  history: Activity[],
  region: string,
  budget: number,
  onRecommendations: (recs: Recommendation[]) => void,
  onInsight: (insight: string) => void,
): Promise<AIFeedbackResult> {
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

    let recommendationsUpdated = false;
    let insightUpdated = false;

    if (recRes.ok) {
      const data = await recRes.json();
      if (data.recommendations?.length) {
        onRecommendations(data.recommendations);
        recommendationsUpdated = true;
      }
    }
    if (insRes.ok) {
      const data = await insRes.json();
      if (data.insight) {
        onInsight(data.insight);
        insightUpdated = true;
      }
    }

    return { recommendationsUpdated, insightUpdated };
  } catch (error) {
    return {
      recommendationsUpdated: false,
      insightUpdated: false,
      error: error instanceof Error ? error.message : "AI feedback request failed",
    };
  }
}
