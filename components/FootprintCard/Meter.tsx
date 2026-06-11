interface MeterProps {
  budgetUsed: number;
}

export function Meter({ budgetUsed }: MeterProps) {
  return (
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
  );
}
