import { Activity } from "@/lib/types";
import { DEFAULT_REGION } from "@/lib/emissions";
import { STORAGE_KEYS, DEFAULTS } from "@/lib/constants";

/**
 * Gets the user's selected region from localStorage.
 * @returns Region identifier, defaults to global if not set
 */
export function getRegion(): string {
  if (typeof window === "undefined") return DEFAULT_REGION;
  return localStorage.getItem(STORAGE_KEYS.REGION) || DEFAULT_REGION;
}

/**
 * Sets the user's selected region in localStorage.
 * @param region - Region identifier to store
 */
export function setRegion(region: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.REGION, region);
}

/**
 * Gets the user's logged activities from localStorage.
 * @returns Array of activities, empty if none or parse error
 */
export function getActivities(): Activity[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Persists the user's activities to localStorage.
 * @param activities - Array of activities to store
 */
export function setActivities(activities: Activity[]): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
}

/**
 * Gets the user's daily carbon budget from localStorage.
 * @returns Budget in kg CO2e, defaults to 10 if not set or invalid
 */
export function getBudget(): number {
  if (typeof window === "undefined") return DEFAULTS.DAILY_BUDGET;
  const raw = localStorage.getItem(STORAGE_KEYS.BUDGET);
  if (!raw) return DEFAULTS.DAILY_BUDGET;
  const val = parseFloat(raw);
  return isNaN(val) || val <= 0 ? DEFAULTS.DAILY_BUDGET : val;
}

/**
 * Sets the user's daily carbon budget in localStorage.
 * @param budget - Budget in kg CO2e
 */
export function setBudget(budget: number): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEYS.BUDGET, String(budget));
}

/**
 * Clears all CarbonKeeper data from localStorage.
 */
export function clearAll(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(STORAGE_KEYS.ACTIVITIES);
  localStorage.removeItem(STORAGE_KEYS.BUDGET);
  localStorage.removeItem(STORAGE_KEYS.REGION);
}