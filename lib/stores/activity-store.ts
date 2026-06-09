import { create } from "zustand";
import type { Activity } from "@/lib/types";
import { computeDailyFootprint, computeWeeklyTrend } from "@/lib/compute";
import { getActivities, getBudget } from "@/lib/storage";
import { recalculateBudget } from "./budget-utils";

interface ActivityState {
  activities: Activity[];
  dailyFootprint: number;
  budgetUsed: number;
  weeklyTrend: { date: string; value: number }[];
  dailyBudget: number;
  addActivity: (activity: Activity) => void;
  clearActivities: () => void;
  loadSampleData: () => Promise<void>;
  recalculate: (budget: number) => void;
  setDailyBudget: (budget: number) => void;
}

const initialActivities = getActivities();
const initialBudget = getBudget();

export const useActivityStore = create<ActivityState>((set) => ({
  activities: initialActivities,
  dailyFootprint: computeDailyFootprint(initialActivities),
  budgetUsed: Math.min(
    (computeDailyFootprint(initialActivities) / initialBudget) * 100,
    100,
  ),
  weeklyTrend: computeWeeklyTrend(initialActivities),
  dailyBudget: initialBudget,

  addActivity: (activity) =>
    set((state) => {
      const newActivities = [...state.activities, activity];
      const daily = computeDailyFootprint(newActivities);
      return {
        activities: newActivities,
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / state.dailyBudget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(newActivities),
      };
    }),

  clearActivities: () => {
    set({
      activities: [],
      dailyFootprint: 0,
      budgetUsed: 0,
      weeklyTrend: [],
    });
  },

  loadSampleData: async () => {
    try {
      const res = await fetch("/data/sample-activities.json");
      const data: Activity[] = await res.json();
      const daily = computeDailyFootprint(data);
      set((state) => ({
        activities: data,
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / state.dailyBudget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(data),
      }));
    } catch {
      // Error handling without toast (toast moved to component)
    }
  },

  recalculate: (budget: number) =>
    set((state) => {
      const result = recalculateBudget(state.activities, budget);
      return { ...result, dailyBudget: budget };
    }),

  setDailyBudget: (budget: number) =>
    set((state) => {
      const result = recalculateBudget(state.activities, budget);
      return { ...result, dailyBudget: budget };
    }),
}));