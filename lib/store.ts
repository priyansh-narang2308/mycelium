import { create } from "zustand";
import { Activity, Recommendation, Challenge } from "./types";
import { toast } from "sonner";
import { startOfDay, subDays, format } from "date-fns";

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
  addActivity: (activity: Activity) => void;
  setDailyBudget: (budget: number) => void;
  setRecommendations: (recs: Recommendation[]) => void;
  setInsight: (insight: string) => void;
  setIsProcessing: (status: boolean) => void;
  toggleChallenge: (id: string) => void;
  loadSampleData: () => Promise<void>;
  clearActivities: () => void;
  getDailyBudget: () => number;
}

function computeWeeklyTrend(activities: Activity[]) {
  const today = startOfDay(new Date());
  const buckets: Record<string, number> = {};
  for (let i = 6; i >= 0; i--) {
    const d = subDays(today, i);
    const key = format(d, "EEE");
    buckets[key] = 0;
  }
  for (const act of activities) {
    const day = startOfDay(new Date(act.timestamp));
    const key = format(day, "EEE");
    if (key in buckets) {
      buckets[key] += act.co2e;
    }
  }
  return Object.entries(buckets).map(([date, value]) => ({ date, value }));
}

function computeDailyFootprint(activities: Activity[]) {
  const today = startOfDay(new Date());
  return activities
    .filter(
      (a) => startOfDay(new Date(a.timestamp)).getTime() === today.getTime(),
    )
    .reduce((sum, a) => sum + a.co2e, 0);
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

export const useStore = create<AppState>((set) => ({
  activities: [],
  dailyFootprint: 0,
  budgetUsed: 0,
  weeklyTrend: [],
  recommendations: [],
  challenges: DEFAULT_CHALLENGES,
  insight: null,
  isProcessing: false,
  dailyBudget: 10,

  setDailyBudget: (budget: number) => set({ dailyBudget: budget }),

  addActivity: (activity) =>
    set((state) => {
      const newActivities = [...state.activities, activity];
      const daily = computeDailyFootprint(newActivities);
      const budget = parseFloat(localStorage.getItem("CARBON_BUDGET") || "10");
      return {
        activities: newActivities,
        dailyFootprint: daily,
        dailyBudget: budget,
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
      const budget = parseFloat(localStorage.getItem("CARBON_BUDGET") || "10");
      set({
        activities: data,
        dailyFootprint: daily,
        dailyBudget: budget,
        budgetUsed: Math.min((daily / budget) * 100, 100),
        weeklyTrend: computeWeeklyTrend(data),
      });
      toast.success("Demo data loaded! Check out your insights.");
    } catch (e) {
      console.error("Failed to load sample data", e);
      toast.error("Failed to load demo data.");
    }
  },

  clearActivities: () => {
    const budget = parseFloat(localStorage.getItem("CARBON_BUDGET") || "10");
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

  getDailyBudget: () => {
    return parseFloat(localStorage.getItem("CARBON_BUDGET") || "10");
  },
}));
