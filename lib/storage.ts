
import { Activity } from "@/lib/types";
import { DEFAULT_REGION } from "@/lib/emissions";

const PERSIST_KEY = "CARBON_ACTIVITIES";
const DEFAULT_BUDGET = 10;

export function getStoredRegion(): string {
  if (typeof window === "undefined") return DEFAULT_REGION;
  return localStorage.getItem("CARBON_REGION") || DEFAULT_REGION;
}

export function getStoredActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(PERSIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function persistActivities(activities: Activity[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(PERSIST_KEY, JSON.stringify(activities));
}

export function readBudget(): number {
  if (typeof window === "undefined") return DEFAULT_BUDGET;
  const raw = localStorage.getItem("CARBON_BUDGET");
  if (!raw) return DEFAULT_BUDGET;
  const val = parseFloat(raw);
  return isNaN(val) || val <= 0 ? DEFAULT_BUDGET : val;
}
