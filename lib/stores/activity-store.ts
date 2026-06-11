import { create } from "zustand";
import type { Activity } from "@/lib/types";
import {
  getActivities,
  getBudget,
  setActivities,
  clearStoredActivities,
} from "@/lib/storage";
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
}

const initialActivities = getActivities();
const initialBudget = getBudget();
const initialMetrics = recalculateBudget(initialActivities, initialBudget);

export const useActivityStore = create<ActivityState>((set) => ({
  activities: initialActivities,
  dailyFootprint: initialMetrics.dailyFootprint,
  budgetUsed: initialMetrics.budgetUsed,
  weeklyTrend: initialMetrics.weeklyTrend,
  dailyBudget: initialBudget,

  addActivity: (activity) =>
    set((state) => {
      const newActivities = [...state.activities, activity];
      setActivities(newActivities);
      return {
        activities: newActivities,
        ...recalculateBudget(newActivities, state.dailyBudget),
      };
    }),

  clearActivities: () => {
    clearStoredActivities();
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
      setActivities(data);
      set((state) => ({
        activities: data,
        ...recalculateBudget(data, state.dailyBudget),
      }));
    } catch {
      // Error handling without toast (toast moved to component)
    }
  },

  recalculate: (budget: number) =>
    set((state) => ({
      ...recalculateBudget(state.activities, budget),
      dailyBudget: budget,
    })),
}));