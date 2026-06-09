import { create } from "zustand";
import type { Activity } from "@/lib/types";
import { computeDailyFootprint, computeWeeklyTrend } from "@/lib/compute";
import { getActivities, setActivities, getBudget } from "@/lib/storage";
import { UI } from "@/lib/constants";
import { toast } from "sonner";
import { useSettingsStore } from "./settings-store";

interface ActivityState {
  activities: Activity[];
  dailyFootprint: number;
  budgetUsed: number;
  weeklyTrend: { date: string; value: number }[];
  addActivity: (activity: Activity) => void;
  clearActivities: () => void;
  loadSampleData: () => Promise<void>;
  recalculate: (budget: number) => void;
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

  addActivity: (activity) =>
    set((state) => {
      const newActivities = [...state.activities, activity];
      setActivities(newActivities);
      const daily = computeDailyFootprint(newActivities);
      const budget = useSettingsStore.getState().dailyBudget;
      return {
        activities: newActivities,
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / budget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(newActivities),
      };
    }),

  clearActivities: () => {
    setActivities([]);
    getBudget();
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
      setActivities(data);
      const loadedBudget = getBudget();
      set({
        activities: data,
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / loadedBudget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(data),
      });
      toast.success(UI.TOAST_SUCCESS_DEMO);
    } catch {
      toast.error(UI.TOAST_ERROR_DEMO);
    }
  },

  recalculate: (budget: number) =>
    set(() => {
      const activities = useActivityStore.getState().activities;
      const daily = computeDailyFootprint(activities);
      const _budget = budget;
      return {
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / _budget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(activities),
      };
    }),
}));