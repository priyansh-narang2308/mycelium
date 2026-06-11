import { motion } from "framer-motion";
import type { Recommendation } from "@/lib/types";

interface RecommendationItemProps {
  rec: Recommendation;
  index: number;
}

export function RecommendationItem({ rec, index }: RecommendationItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.1 }}
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
  );
}
