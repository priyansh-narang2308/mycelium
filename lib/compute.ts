import { startOfDay, subDays, format } from "date-fns";
import type { Activity } from "@/lib/types";

/**
 * Computes the weekly emissions trend for the last 7 days.
 * @param activities - Array of logged activities
 * @returns Array of { date, value } for each day (Mon-Sun)
 */
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

/**
 * Computes today's total carbon footprint from logged activities.
 * @param activities - Array of logged activities
 * @returns Total emissions in kg CO2e for today
 */
export function computeDailyFootprint(activities: Activity[]) {
  const today = startOfDay(new Date());
  return activities
    .filter(
      (a) => startOfDay(new Date(a.timestamp)).getTime() === today.getTime(),
    )
    .reduce((sum, a) => sum + a.co2e, 0);
}
