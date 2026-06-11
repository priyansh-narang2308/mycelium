import { startOfDay, subDays, format } from "date-fns";
import type { Activity } from "@/lib/types";

export interface CategoryBreakdownEntry {
  name: string;
  value: number;
}

export function computeWeeklyTrend(activities: Activity[]) {
  const today = startOfDay(new Date());
  const buckets: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const day = subDays(today, i);
    const key = format(day, "EEE");
    buckets[key] = 0;
  }
  for (const activity of activities) {
    const day = startOfDay(new Date(activity.timestamp));
    const key = format(day, "EEE");
    if (key in buckets) {
      buckets[key] += activity.co2e;
    }
  }
  return Object.entries(buckets).map(([date, value]) => ({ date, value }));
}

export function computeDailyFootprint(activities: Activity[]) {
  const today = startOfDay(new Date());
  return activities
    .filter(
      (a) => startOfDay(new Date(a.timestamp)).getTime() === today.getTime(),
    )
    .reduce((sum, a) => sum + a.co2e, 0);
}

export function computeCategoryBreakdown(
  activities: Activity[],
): CategoryBreakdownEntry[] {
  return activities.reduce<CategoryBreakdownEntry[]>((acc, curr) => {
    const existing = acc.find((item) => item.name === curr.category);
    if (existing) {
      existing.value += curr.co2e;
    } else {
      acc.push({ name: curr.category, value: curr.co2e });
    }
    return acc;
  }, []);
}
