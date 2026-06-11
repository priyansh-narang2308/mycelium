import { create } from "zustand";
import { getRegion, setRegion, getBudget, setBudget } from "@/lib/storage";

interface SettingsState {
  dailyBudget: number;
  region: string;
  setDailyBudget: (budget: number) => void;
  setRegion: (region: string) => void;
}

export const useSettingsStore = create<SettingsState>((set) => ({
  dailyBudget: getBudget(),
  region: getRegion(),

  setDailyBudget: (budget: number) =>
    set(() => {
      setBudget(budget);
      return { dailyBudget: budget };
    }),

  setRegion: (region: string) =>
    set(() => {
      setRegion(region);
      return { region };
    }),
}));