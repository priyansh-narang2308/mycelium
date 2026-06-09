import { useActivityStore } from "./activity-store";
import { useSettingsStore } from "./settings-store";
import { useAIStore } from "./ai-store";

export { useActivityStore } from "./activity-store";
export { useSettingsStore } from "./settings-store";
export { useAIStore } from "./ai-store";

export function useStore() {
  const activity = useActivityStore();
  const settings = useSettingsStore();
  const ai = useAIStore();

  return {
    ...activity,
    ...settings,
    ...ai,
  };
}

export function useActivities() {
  return useActivityStore((s) => s.activities);
}

export function useDailyFootprint() {
  return useActivityStore((s) => s.dailyFootprint);
}

export function useBudgetUsed() {
  return useActivityStore((s) => s.budgetUsed);
}

export function useWeeklyTrend() {
  return useActivityStore((s) => s.weeklyTrend);
}

export function useDailyBudget() {
  return useSettingsStore((s) => s.dailyBudget);
}

export function useRegion() {
  return useSettingsStore((s) => s.region);
}

export function useRecommendations() {
  return useAIStore((s) => s.recommendations);
}

export function useChallenges() {
  return useAIStore((s) => s.challenges);
}

export function useInsight() {
  return useAIStore((s) => s.insight);
}

export function useIsProcessing() {
  return useAIStore((s) => s.isProcessing);
}

export function useAddActivity() {
  return useActivityStore((s) => s.addActivity);
}

export function useSetDailyBudget() {
  return useSettingsStore((s) => s.setDailyBudget);
}

export function useSetRegion() {
  return useSettingsStore((s) => s.setRegion);
}

export function useSetRecommendations() {
  return useAIStore((s) => s.setRecommendations);
}

export function useSetInsight() {
  return useAIStore((s) => s.setInsight);
}

export function useSetIsProcessing() {
  return useAIStore((s) => s.setIsProcessing);
}

export function useToggleChallenge() {
  return useAIStore((s) => s.toggleChallenge);
}

export function useLoadSampleData() {
  return useActivityStore((s) => s.loadSampleData);
}

export function useClearActivities() {
  return useActivityStore((s) => s.clearActivities);
}