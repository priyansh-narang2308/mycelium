import { create } from "zustand";
import { Activity, Recommendation } from "./types";

interface AppState {
  activities: Activity[];
  dailyFootprint: number;
  budgetUsed: number;
  recommendations: Recommendation[];
  insight: string | null;
  isProcessing: boolean;
  addActivity: (activity: Activity) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setInsight: (insight: string) => void;
  setIsProcessing: (status: boolean) => void;
  loadSampleData: () => Promise<void>;
  clearActivities: () => void;
}

export const useStore = create<AppState>((set) => ({
  activities: [],
  dailyFootprint: 0,
  budgetUsed: 0,
  recommendations: [],
  insight: null,
  isProcessing: false,
  addActivity: (activity) =>
    set((state) => {
      const newActivities = [...state.activities, activity];
      const daily = newActivities.reduce((sum, a) => sum + a.co2e, 0);
      return {
        activities: newActivities,
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / 10) * 100, 100),
      };
    }),
  setRecommendations: (recs) => set({ recommendations: recs }),
  setInsight: (insight) => set({ insight }),
  setIsProcessing: (status) => set({ isProcessing: status }),
  loadSampleData: async () => {
    try {
      const res = await fetch("/data/sample-activities.json");
      const data = await res.json();
      const daily = data.reduce((sum: number, a: Activity) => sum + a.co2e, 0);
      set({
        activities: data,
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / 10) * 100, 100),
      });
    } catch (e) {
      console.error("Failed to load sample data", e);
    }
  },
  clearActivities: () =>
    set({
      activities: [],
      dailyFootprint: 0,
      budgetUsed: 0,
      recommendations: [],
      insight: null,
    }),
}));
