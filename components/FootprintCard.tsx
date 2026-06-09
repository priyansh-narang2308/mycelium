"use client";
import { useMemo } from "react";
import { Leaf, TrendingDown } from "lucide-react";
import type { Activity } from "@/lib/types";
import { CategoryChart } from "@/components/charts/CategoryChart";

interface Props {
  activities: Activity[];
  dailyFootprint: number;
  budgetUsed: number;
  dailyBudget: number;
  insight: string | null;
}

export function FootprintCard({ activities, dailyFootprint, budgetUsed, dailyBudget, insight }: Props) {
  const chartData = useMemo(
    () =>
      activities.reduce(
        (acc, curr) => {
          const existing = acc.find((item) => item.name === curr.category);
          if (existing) existing.value += curr.co2e;
          else acc.push({ name: curr.category, value: curr.co2e });
          return acc;
        },
        [] as { name: string; value: number }[],
      ),
    [activities],
  );

  const remaining = useMemo(() => Math.max(dailyBudget - dailyFootprint, 0), [dailyBudget, dailyFootprint]);

  return (
    <div className="col-span-1 bg-brand-teal text-white rounded-[24px] p-8 flex flex-col justify-between">
      <div>
        <h3 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
          <Leaf className="w-6 h-6 text-brand-mint" aria-hidden="true" />
          Understand: Daily Footprint
        </h3>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-[64px] font-medium leading-none tracking-[-1.5px]">{dailyFootprint.toFixed(1)}</span>
          <span className="text-white/80 font-medium">kg CO₂e</span>
        </div>
        <p className="text-brand-mint text-[15px] font-semibold mb-6">
          {budgetUsed.toFixed(0)}% of {dailyBudget} kg daily budget
        </p>
        {remaining > 0 ? (
          <p className="text-white/70 text-[14px] font-medium">
            <TrendingDown className="w-4 h-4 inline mr-1" aria-hidden="true" />
            {remaining.toFixed(1)} kg remaining today
          </p>
        ) : (
          <p className="text-brand-pink text-[14px] font-medium">
            Over budget by {Math.abs(remaining).toFixed(1)} kg
          </p>
        )}
      </div>

      <div className="mt-6">
        <div className="h-3 bg-black/20 rounded-full overflow-hidden">
          <div
            className="h-full bg-brand-mint rounded-full transition-all duration-500"
            style={{ width: `${Math.min(budgetUsed, 100)}%` }}
            role="meter"
            aria-valuenow={budgetUsed}
            aria-valuemin={0}
            aria-valuemax={100}
          />
        </div>
      </div>

      <CategoryChart data={chartData} />

      <div className="bg-black/20 rounded-xl p-4 mt-6" aria-live="polite">
        <p className="text-[15px] font-medium text-white/90">
          {insight || "Every small step counts towards a greener future."}
        </p>
      </div>
    </div>
  );
}