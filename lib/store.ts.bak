import { create } from "zustand";
import { Activity, Recommendation, Challenge } from "@/lib/types";
import { toast } from "sonner";
import { computeDailyFootprint, computeWeeklyTrend } from "@/lib/compute";
import {
  getStoredRegion,
  getStoredActivities,
  persistActivities,
  readBudget,
} from "@/lib/storage";

interface AppState {
  activities: Activity[];
  dailyFootprint: number;
  budgetUsed: number;
  weeklyTrend: { date: string; value: number }[];
  recommendations: Recommendation[];
  challenges: Challenge[];
  insight: string | null;
  isProcessing: boolean;
  dailyBudget: number;
  region: string;
  addActivity: (activity: Activity) => void;
  setDailyBudget: (budget: number) => void;
  setRegion: (region: string) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setInsight: (insight: string) => void;
  setIsProcessing: (status: boolean) => void;
  toggleChallenge: (id: string) => void;
  loadSampleData: () => Promise<void>;
  clearActivities: () => void;
}

const DEFAULT_CHALLENGES: Challenge[] = [
  {
    id: "meatless-mon",
    title: "Meatless Monday",
    description: "Skip meat for one day",
    active: false,
    streak: 0,
    completed: false,
  },
  {
    id: "bike-wed",
    title: "Bike to Work Wednesday",
    description: "Use a bike instead of a car",
    active: false,
    streak: 0,
    completed: false,
  },
  {
    id: "public-transit",
    title: "Public Transit Week",
    description: "Take the bus or train instead of driving",
    active: false,
    streak: 0,
    completed: false,
  },
];

const preloadedActivities = getStoredActivities();

const preloadedBudget = readBudget();

export const useStore = create<AppState>((set) => ({
  activities: preloadedActivities,
  dailyFootprint: computeDailyFootprint(preloadedActivities),
  budgetUsed: Math.min(
    (computeDailyFootprint(preloadedActivities) / preloadedBudget) * 100,
    100,
  ),
  weeklyTrend: computeWeeklyTrend(preloadedActivities),
  recommendations: [],
  challenges: DEFAULT_CHALLENGES,
  insight: null,
  isProcessing: false,
  dailyBudget: preloadedBudget,
  region: getStoredRegion(),

  setDailyBudget: (budget: number) =>
    set((state) => {
      if (typeof window !== "undefined") {
        localStorage.setItem("CARBON_BUDGET", String(budget));
      }
      return {
        dailyBudget: budget,
        budgetUsed: Math.min((state.dailyFootprint / budget) * 100, 100),
      };
    }),
  setRegion: (region: string) =>
    set(() => {
      if (typeof window !== "undefined") {
        localStorage.setItem("CARBON_REGION", region);
      }
      return { region };
    }),

  addActivity: (activity) =>
    set((state) => {
      const newActivities = [...state.activities, activity];
      persistActivities(newActivities);
      const daily = computeDailyFootprint(newActivities);
      const budget = state.dailyBudget;
      return {
        activities: newActivities,
        dailyFootprint: daily,
        budgetUsed: Math.min((daily / budget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(newActivities),
      };
    }),

  setRecommendations: (recs) => set({ recommendations: recs }),
  setInsight: (insight) => set({ insight }),
  setIsProcessing: (status) => set({ isProcessing: status }),

  toggleChallenge: (id) =>
    set((state) => ({
      challenges: state.challenges.map((c) =>
        c.id === id
          ? {
              ...c,
              active: !c.active,
              streak: !c.active ? c.streak + 1 : c.streak,
            }
          : c,
      ),
    })),

  loadSampleData: async () => {
    try {
      const res = await fetch("/data/sample-activities.json");
      const data: Activity[] = await res.json();
      const daily = computeDailyFootprint(data);
      persistActivities(data);
      const loadedBudget = readBudget();
      set({
        activities: data,
        dailyFootprint: daily,
        dailyBudget: loadedBudget,
        budgetUsed: Math.min((daily / loadedBudget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(data),
      });
      toast.success("Demo data loaded! Check out your insights.");
    } catch {
      toast.error("Failed to load demo data.");
    }
  },

  clearActivities: () => {
    persistActivities([]);
    const budget = readBudget();
    set({
      activities: [],
      dailyFootprint: 0,
      dailyBudget: budget,
      budgetUsed: 0,
      weeklyTrend: [],
      recommendations: [],
      insight: null,
    });
  },
}));
