"use client";

import { useCallback } from "react";
import { logActivityWithDeps } from "@/lib/services/activity-service";
import { useActivityStore } from "@/lib/stores/activity-store";
import { useAIStore } from "@/lib/stores/ai-store";
import { useSettingsStore } from "@/lib/stores/settings-store";

export function useLogActivity() {
  const region = useSettingsStore((s) => s.region);
  const dailyBudget = useSettingsStore((s) => s.dailyBudget);
  const activities = useActivityStore((s) => s.activities);
  const addActivity = useActivityStore((s) => s.addActivity);
  const setRecommendations = useAIStore((s) => s.setRecommendations);
  const setInsight = useAIStore((s) => s.setInsight);

  return useCallback(
    (input: string) =>
      logActivityWithDeps(input, {
        region,
        dailyBudget,
        activities,
        addActivity,
        setRecommendations,
        setInsight,
      }),
    [
      region,
      dailyBudget,
      activities,
      addActivity,
      setRecommendations,
      setInsight,
    ],
  );
}
