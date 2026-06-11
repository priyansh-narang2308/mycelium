interface BudgetMeterProps {
  budgetUsed: number;
  dailyFootprint: number;
  dailyBudget: number;
  insight?: string | null;
}

export function BudgetMeter({
  budgetUsed,
  dailyFootprint,
  dailyBudget,
  insight,
}: BudgetMeterProps) {
  const fallbackMessage =
    budgetUsed === 0
      ? "Log an activity to get started."
      : "You're on track! Keep up the good work.";

  return (
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
        {insight || fallbackMessage}
      </p>
    </div>
  );
}
