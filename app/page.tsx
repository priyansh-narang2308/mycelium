"use client";
import { useEffect } from "react";
import { useStore } from "../lib/store";
import { ActivityLog } from "../components/ActivityLog";
import { Leaf, Zap, Map } from "lucide-react";
import { motion } from "framer-motion";

export default function Home() {
  const { activities, loadSampleData, dailyFootprint, recommendations, insight } = useStore();

  useEffect(() => {
    loadSampleData();
  }, [loadSampleData]);

  return (
    <main className="min-h-screen bg-canvas text-body font-sans pb-24 selection:bg-brand-pink selection:text-white">
      <div className="relative z-10 max-w-6xl mx-auto px-6 py-24">
        {/* Header (Clay 7-5 split layout) */}
        <header className="mb-24 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="md:w-7/12 text-center md:text-left">
            <h1 className="text-[56px] md:text-[72px] font-medium text-ink tracking-[-2.5px] leading-[1.0] mb-6">
              Go to market with a lighter footprint.
            </h1>
            <p className="text-[18px] text-muted max-w-xl leading-relaxed mb-8 font-medium">
              A playful B2B command-palette for your carbon footprint. Log your activities naturally, let AI calculate the impact, and discover high-leverage swaps to reduce your emissions.
            </p>
            <ActivityLog />
          </div>
          <div className="md:w-5/12 flex justify-center hidden md:flex">
             {/* Simple Clay-style placeholder illustration / blob */}
             <div className="w-80 h-80 bg-brand-peach rounded-[40px] transform rotate-3 flex items-center justify-center shadow-xl border border-ink/5">
                <Leaf className="w-32 h-32 text-ink opacity-90" />
             </div>
          </div>
        </header>

        {/* Dashboard Content */}
        {activities.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {/* Meter Card (Teal) */}
            <div className="col-span-1 bg-brand-teal text-white rounded-[24px] p-8">
              <h3 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-brand-mint" />
                Daily Footprint
              </h3>
              <div className="flex items-baseline gap-2 mb-4">
                <span className="text-[64px] font-medium leading-none tracking-[-1.5px]">{dailyFootprint.toFixed(1)}</span>
                <span className="text-white/80 font-medium">kg CO2e</span>
              </div>
              <div className="bg-black/20 rounded-xl p-4">
                <p className="text-[15px] font-medium text-white/90">
                  {insight || "Every small step counts towards a greener future."}
                </p>
              </div>
            </div>

            {/* Recommendations (Peach) */}
            <div className="col-span-2 bg-brand-peach text-ink rounded-[24px] p-8">
               <h3 className="text-[20px] font-semibold mb-6 flex items-center gap-2 tracking-tight">
                <Zap className="w-6 h-6" />
                AI Leverage Points
              </h3>
              <div className="grid gap-4">
                {recommendations.length > 0 ? recommendations.map((rec, i) => (
                  <motion.div 
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    key={rec.id} 
                    className="bg-canvas/60 rounded-xl p-5 flex justify-between items-center border border-ink/5"
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
                )) : (
                  <div className="text-ink/60 text-[15px] font-medium p-6 text-center border-2 border-dashed border-ink/20 rounded-xl bg-canvas/40">
                    Log more activities to get personalized leverage point recommendations.
                  </div>
                )}
              </div>
            </div>
            
            {/* Activity Stream (Cream Card) */}
            <div className="col-span-3 bg-surface-card rounded-[24px] p-8 mt-4 border border-hairline shadow-sm">
               <h3 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
                <Map className="w-6 h-6 text-brand-pink" />
                Recent Logs
              </h3>
              <div className="flex flex-col">
                {activities.slice().reverse().map((act, i) => (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={act.id + i} 
                    className="flex justify-between items-center py-4 border-b border-hairline last:border-0 hover:bg-surface-strong rounded-xl px-4 -mx-4 transition-colors"
                  >
                    <div>
                      <div className="text-ink font-semibold text-[16px]">{act.amount}{act.unit} {act.subCategory}</div>
                      <div className="text-muted text-[14px] font-medium mt-1">{act.rawInput || "Quick Log"}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-ink font-semibold text-[16px]">{act.co2e.toFixed(2)} kg</div>
                      <div className="text-muted text-[13px] font-medium">{act.equivalent}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </main>
  );
}
