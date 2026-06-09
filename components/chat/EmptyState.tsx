"use client";

interface EmptyStateProps {
  activities: { length: number };
}

export function EmptyState({ activities }: EmptyStateProps) {
  if (activities.length > 0) return null;

  return (
    <div className="mb-8 p-4 rounded-xl bg-brand-peach/20 border border-brand-peach/30 text-ink font-medium text-[14px]">
      Log some activities first to get personalized answers about your
      carbon footprint.
    </div>
  );
}