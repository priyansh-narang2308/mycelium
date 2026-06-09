import { computeDailyFootprint, computeWeeklyTrend } from "@/lib/compute";
import type { Activity } from "@/lib/types";

export function recalculateBudget(activities: Activity[], budget: number) {
  const daily = computeDailyFootprint(activities);
  return {
    dailyFootprint: daily,
    budgetUsed: Math.min((daily / budget) * 100, 100),
    weeklyTrend: computeWeeklyTrend(activities),
  };
}
