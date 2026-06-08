import { create } from "zustand";
import { Activity, Recommendation, Challenge } from "@/lib/types";
import { toast } from "sonner";
import { startOfDay, subDays, format } from "date-fns";
import { DEFAULT_REGION } from "@/lib/emissions";

const PERSIST_KEY = "CARBON_ACTIVITIES";

/**
 * Retrieves the user's preferred region configuration from local storage.
 * Defaults to global average if not present or during server-side rendering.
 *
 * @returns {string} The active region identifier.
 */
function getStoredRegion(): string {
  if (typeof window === "undefined") return DEFAULT_REGION;
  return localStorage.getItem("CARBON_REGION") || DEFAULT_REGION;
}

/**
 * Retrieves the cached activity log array from local storage.
 * Returns an empty array if empty, corrupted, or during server-side rendering.
 *
 * @returns {Activity[]} List of saved user carbon activities.
 */
function getStoredActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persists the activity log array to local storage.
 * Does nothing during server-side rendering.
 *
 * @param {Activity[]} activities - The array of activities to serialize.
 */
function persistActivities(activities: Activity[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERSIST_KEY, JSON.stringify(activities));
}

/**
 * Reads the daily carbon allowance budget from local storage.
 * Falls back to the default daily budget of 10kg if not set or invalid.
 *
 * @returns {number} The daily carbon limit in kg CO2e.
 */
function readBudget(): number {
  if (typeof window === "undefined") return DEFAULT_BUDGET;
  const raw = localStorage.getItem("CARBON_BUDGET");
  if (!raw) return DEFAULT_BUDGET;
  const val = parseFloat(raw);
  return isNaN(val) || val <= 0 ? DEFAULT_BUDGET : val;
}

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
  getDailyBudget: () => number;
}

/**
 * Computes weekly emission trends by bucketing emissions by weekday (EEE).
 *
 * @param {Activity[]} activities - User logged carbon activities.
 * @returns {{ date: string; value: number }[]} Data array representing emission trends per day.
 */
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

/**
 * Computes today's total carbon emissions footprint in kg CO2e.
 *
 * @param {Activity[]} activities - User logged carbon activities.
 * @returns {number} The total emissions generated today.
 */
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

const preloadedActivities = getStoredActivities();
const DEFAULT_BUDGET = 10;

const preloadedBudget = readBudget();

/**
 * React hook store that maintains the global application state,
 * including activity logs, daily targets, regional parameters,
 * and dynamic insights.
 */
export const useStore = create<AppState>((set, get) => ({
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

  getDailyBudget: () => {
    return get().dailyBudget;
  },
}));
