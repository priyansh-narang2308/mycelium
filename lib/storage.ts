import { Activity } from "@/lib/types";
import { DEFAULT_REGION } from "@/lib/emissions";
import { STORAGE_KEYS, DEFAULTS } from "@/lib/constants";

export function getRegion(): string {
  if (typeof window === "undefined") return DEFAULT_REGION;
  return localStorage.getItem(STORAGE_KEYS.REGION) || DEFAULT_REGION;
}

export function setRegion(region: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REGION, region);
}

export function getActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function setActivities(activities: Activity[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

export function getBudget(): number {
  if (typeof window === "undefined") return DEFAULTS.DAILY_BUDGET;
  const raw = localStorage.getItem(STORAGE_KEYS.BUDGET);
  if (!raw) return DEFAULTS.DAILY_BUDGET;
  const val = parseFloat(raw);
  return isNaN(val) || val <= 0 ? DEFAULTS.DAILY_BUDGET : val;
}

export function setBudget(budget: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BUDGET, String(budget));
}

export function clearAll(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem(STORAGE_KEYS.BUDGET);
  localStorage.removeItem(STORAGE_KEYS.REGION);
}
