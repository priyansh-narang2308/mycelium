"use client";
import { useEffect, useState } from "react";
import { useActivityStore } from "@/lib/stores/activity-store";
import { useAIStore } from "@/lib/stores/ai-store";
import { ActivityLog } from "@/components/ActivityLog";
import { FootprintCard } from "@/components/FootprintCard";
import { RecommendationsList } from "@/components/RecommendationsList";
import { ChallengesList } from "@/components/ChallengesList";
import { WeeklyTrend } from "@/components/WeeklyTrend";
import { RecentLogs } from "@/components/RecentLogs";
import { Leaf, Database, Zap, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import { PageHeader } from "@/components/layout/PageHeader";

export default function Dashboard() {
  const activities = useActivityStore((s) => s.activities);
  const loadSampleData = useActivityStore((s) => s.loadSampleData);
  const recommendations = useAIStore((s) => s.recommendations);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div aria-live="polite">
        <PageHeader
          title="Track, Understand, and Reduce Your Carbon Footprint"
          description="Your personal carbon coach. Log activities, track progress, and discover personalized ways to reduce your impact."
        />
      </div>

      <div className="mb-12">
        <ActivityLog />
      </div>

      {activities.length > 0 ? (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <FootprintCard />

          <div className="col-span-2 bg-brand-peach text-ink rounded-[24px] p-8">
            <h3 className="text-[20px] font-semibold mb-6 flex items-center gap-2 tracking-tight">
              <Zap className="w-6 h-6" aria-hidden="true" />
              Reduce: AI Personalized Carbon Swaps
            </h3>
            <RecommendationsList />
          </div>

          <WeeklyTrend />

          {recommendations.length > 0 && (
            <div className="col-span-3 bg-brand-teal text-white rounded-[24px] p-8 shadow-sm">
              <h3 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-brand-mint" aria-hidden="true" />
                Reduce: Potential Annual Carbon Savings
              </h3>
              <div className="flex items-baseline gap-3 mb-2">
                <span className="text-[48px] font-medium leading-none tracking-[-1.5px]">
                  {recommendations.reduce((sum, r) => sum + r.potentialSavings, 0)}
                </span>
                <span className="text-white/80 font-medium">kg CO₂e / year</span>
              </div>
              <p className="text-brand-mint text-[15px] font-semibold">
                {recommendations.length === 1
                  ? "1 recommended swap can reduce your annual footprint"
                  : `${recommendations.length} recommended swaps can reduce your annual footprint by this amount`}
              </p>
            </div>
          )}

          <div className="col-span-3 md:col-span-2 bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm">
            <h3 className="text-[18px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
              <Zap className="w-5 h-5 text-brand-teal" aria-hidden="true" />
              Reduce: Habit Building Challenges
            </h3>
            <ChallengesList />
          </div>

          <RecentLogs />
        </motion.div>
      ) : (
        <div className="py-24 px-6 text-center bg-canvas border border-dashed border-hairline rounded-[24px] max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-surface-soft rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-muted" aria-hidden="true" />
          </div>
          <h2 className="text-[24px] font-semibold text-ink mb-3">No activities logged yet</h2>
          <p className="text-muted font-medium text-[16px] mb-8 max-w-md mx-auto">
            Start by typing what you did today in the command palette above, like &quot;I drove 15km&quot; or &quot;I ate a burger&quot;. Our AI will handle the rest.
          </p>
          <button
            onClick={() => loadSampleData()}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-surface-strong text-ink font-semibold text-[15px] hover:bg-hairline transition-colors border border-hairline shadow-sm"
          >
            <Database className="w-4 h-4" aria-hidden="true" />
            Load Demo Data
          </button>
        </div>
      )}
    </div>
  );
}
