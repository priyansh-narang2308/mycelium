interface InsightBoxProps {
  insight: string | null;
}

export function InsightBox({ insight }: InsightBoxProps) {
  return (
    <div className="bg-black/20 rounded-xl p-4 mt-6" aria-live="polite">
      <p className="text-[15px] font-medium text-white/90">
        {insight || "Every small step counts towards a greener future."}
      </p>
    </div>
  );
}
