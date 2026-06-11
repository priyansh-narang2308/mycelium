"use client";
import { PieChart } from "lucide-react";
import { useActivityStore } from "@/lib/stores/activity-store";
import { useSettingsStore } from "@/lib/stores/settings-store";
import { useAIStore } from "@/lib/stores/ai-store";
import { RecommendationItem } from "@/components/RecommendationItem";

export default function InsightsPage() {
  const recommendations = useAIStore((s) => s.recommendations);
  const insight = useAIStore((s) => s.insight);
  const dailyFootprint = useActivityStore((s) => s.dailyFootprint);
  const budgetUsed = useActivityStore((s) => s.budgetUsed);
  const isProcessing = useAIStore((s) => s.isProcessing);
  const dailyBudget = useSettingsStore((s) => s.dailyBudget);

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2 flex items-center gap-3">
          Personalized Insights
        </h1>
        <p className="text-muted font-medium">
          Understand your carbon footprint and discover ways to reduce it, powered by CarbonKeeper and Gemini AI.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-canvas border border-hairline rounded-[24px] p-8 shadow-sm">
            <h2 className="text-[18px] font-semibold mb-6 flex items-center gap-2">
              <PieChart
                className="w-5 h-5 text-brand-pink"
                aria-hidden="true"
              />
              Understand: Budget Analysis
            </h2>
            <div className="relative pt-4">
              <div className="flex justify-between text-[14px] font-bold text-ink mb-2">
                <span>{dailyFootprint.toFixed(1)} kg used</span>
                <span>{dailyBudget} kg budget</span>
              </div>
              <div className="w-full h-4 bg-surface-strong rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-1000 ${budgetUsed > 90 ? "bg-brand-pink" : "bg-brand-teal"}`}
                  style={{ width: `${Math.min(budgetUsed, 100)}%` }}
                  role="meter"
                  aria-label="Budget usage percentage"
                  aria-valuenow={budgetUsed}
                  aria-valuemin={0}
                  aria-valuemax={100}
                />
              </div>
              <p className="text-muted text-[14px] font-medium mt-4 leading-relaxed">
                {insight ||
                  (budgetUsed === 0
                    ? "Log an activity to get started."
                    : "You're on track! Keep up the good work.")}
              </p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-surface-soft border border-hairline rounded-[24px] p-8 shadow-sm h-full">
            <h3 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
              Reduce: High-Leverage AI Swaps
            </h3>

            {isProcessing ? (
              <div
                className="animate-pulse space-y-4"
                aria-busy="true"
                aria-label="Loading AI recommendations"
              >
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="h-24 bg-surface-strong rounded-xl w-full"
                  ></div>
                ))}
              </div>
            ) : recommendations.length > 0 ? (
              <div className="grid gap-4">
                {recommendations.map((rec, i) => (
                  <RecommendationItem
                    key={rec.id}
                    rec={rec}
                    index={i}
                    variant="detailed"
                  />
                ))}
              </div>
            ) : (
              <div className="text-muted text-[15px] font-medium p-8 text-center border-2 border-dashed border-hairline rounded-xl bg-canvas">
                Log more activities on the Overview page to let Gemini generate
                personalized lifestyle swaps.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
