"use client";
import { motion } from "framer-motion";
import type { Recommendation } from "@/lib/types";

import { useAIStore } from "@/lib/stores/ai-store";

export function RecommendationsList() {
  const recommendations = useAIStore((s) => s.recommendations);
  return (
    <div className="grid gap-4" aria-live="polite">
      {recommendations.length > 0 ? (
        recommendations.map((rec, i) => (
          <motion.div
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={rec.id}
            className="bg-canvas/60 rounded-xl p-5 flex justify-between items-center border border-ink/5 shadow-sm"
          >
            <div>
              <h4 className="font-semibold text-[16px] mb-1">{rec.title}</h4>
              <p className="text-ink/80 text-[14px]">{rec.description}</p>
            </div>
            <div className="text-right ml-4 shrink-0">
              <span className="block text-brand-teal font-bold text-[18px]">-{rec.potentialSavings}kg</span>
              <span className="text-[12px] text-ink/70 uppercase tracking-wider font-semibold">{rec.difficulty}</span>
            </div>
          </motion.div>
        ))
      ) : (
        <div className="text-ink/60 text-[15px] font-medium p-6 text-center border-2 border-dashed border-ink/20 rounded-xl bg-canvas/40">
          Log more activities to get personalized recommendations.
        </div>
      )}
    </div>
  );
}
