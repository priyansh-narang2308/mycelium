"use client";
import { useEffect, useState, useMemo } from "react";
import { useStore } from "../../lib/store";
import { ActivityLog } from "../../components/ActivityLog";
import { Leaf, Zap, Map, Database, Target, TrendingDown } from "lucide-react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";

const PieChart = dynamic(() => import("recharts").then((m) => m.PieChart), {
  ssr: false,
});
const Pie = dynamic(() => import("recharts").then((m) => m.Pie), {
  ssr: false,
});
const Cell = dynamic(() => import("recharts").then((m) => m.Cell), {
  ssr: false,
});
const Tooltip = dynamic(() => import("recharts").then((m) => m.Tooltip), {
  ssr: false,
});
const ResponsiveContainer = dynamic(
  () => import("recharts").then((m) => m.ResponsiveContainer),
  { ssr: false },
);
const BarChart = dynamic(() => import("recharts").then((m) => m.BarChart), {
  ssr: false,
});
const Bar = dynamic(() => import("recharts").then((m) => m.Bar), {
  ssr: false,
});
const XAxis = dynamic(() => import("recharts").then((m) => m.XAxis), {
  ssr: false,
});
const YAxis = dynamic(() => import("recharts").then((m) => m.YAxis), {
  ssr: false,
});

const COLORS: Record<string, string> = {
  transport: "#14b8a6",
  food: "#f87171",
  energy: "#fbbf24",
  shopping: "#a78bfa",
};

export default function Dashboard() {
  const {
    activities,
    dailyFootprint,
    budgetUsed,
    dailyBudget,
    weeklyTrend,
    recommendations,
    challenges,
    insight,
    loadSampleData,
    toggleChallenge,
  } = useStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const chartData = useMemo(
    () =>
      activities.reduce(
        (acc, curr) => {
          const existing = acc.find((item) => item.name === curr.category);
          if (existing) {
            existing.value += curr.co2e;
          } else {
            acc.push({ name: curr.category, value: curr.co2e });
          }
          return acc;
        },
        [] as { name: string; value: number }[],
      ),
    [activities],
  );

  const remaining = useMemo(
    () => Math.max(dailyBudget - dailyFootprint, 0),
    [dailyBudget, dailyFootprint],
  );

  if (!mounted) return null;

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12" aria-live="polite">
        <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2">
          Welcome back.
        </h1>
        <p className="text-muted font-medium">
          Here is your carbon footprint overview for today.
        </p>
      </header>

      <div className="mb-12">
        <ActivityLog />
      </div>

      {activities.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          {/* Footprint Card */}
          <div className="col-span-1 bg-brand-teal text-white rounded-[24px] p-8 flex flex-col justify-between">
            <div>
              <h3 className="text-[18px] font-semibold mb-4 flex items-center gap-2">
                <Leaf className="w-6 h-6 text-brand-mint" aria-hidden="true" />
                Daily Footprint
              </h3>
              <div className="flex items-baseline gap-2 mb-1">
                <span className="text-[64px] font-medium leading-none tracking-[-1.5px]">
                  {dailyFootprint.toFixed(1)}
                </span>
                <span className="text-white/80 font-medium">kg CO₂e</span>
              </div>
              <p className="text-brand-mint text-[15px] font-semibold mb-6">
                {budgetUsed.toFixed(0)}% of {dailyBudget} kg daily budget
              </p>
              {remaining > 0 ? (
                <p className="text-white/70 text-[14px] font-medium">
                  <TrendingDown
                    className="w-4 h-4 inline mr-1"
                    aria-hidden="true"
                  />
                  {remaining.toFixed(1)} kg remaining today
                </p>
              ) : (
                <p className="text-brand-pink text-[14px] font-medium">
                  Over budget by {Math.abs(remaining).toFixed(1)} kg
                </p>
              )}
            </div>

            {/* Budget Meter */}
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

            {chartData.length > 0 && (
              <div className="mt-6">
                <div
                  className="h-[180px] w-full"
                  role="img"
                  aria-label="Category breakdown chart"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={50}
                        outerRadius={70}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {chartData.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[entry.name] || "#94a3b8"}
                          />
                        ))}
                      </Pie>
                      <Tooltip
                        formatter={(value: unknown) => [
                          `${Number(value).toFixed(2)} kg`,
                          "Emissions",
                        ]}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "none",
                          boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div
                  className="mt-3 flex flex-wrap gap-3 text-[12px] font-semibold"
                  aria-hidden="true"
                >
                  {chartData.map((entry) => (
                    <span
                      key={entry.name}
                      className="flex items-center gap-1.5 capitalize"
                    >
                      <span
                        className="w-3 h-3 rounded-sm inline-block"
                        style={{
                          backgroundColor: COLORS[entry.name] || "#94a3b8",
                        }}
                      />
                      {entry.name}: {entry.value.toFixed(1)} kg
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-black/20 rounded-xl p-4 mt-6" aria-live="polite">
              <p className="text-[15px] font-medium text-white/90">
                {insight || "Every small step counts towards a greener future."}
              </p>
            </div>
          </div>

          {/* Recommendations */}
          <div className="col-span-2 bg-brand-peach text-ink rounded-[24px] p-8">
            <h3 className="text-[20px] font-semibold mb-6 flex items-center gap-2 tracking-tight">
              <Zap className="w-6 h-6" aria-hidden="true" />
              AI Recommendations
            </h3>
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
                      <h4 className="font-semibold text-[16px] mb-1">
                        {rec.title}
                      </h4>
                      <p className="text-ink/80 text-[14px]">
                        {rec.description}
                      </p>
                    </div>
                    <div className="text-right ml-4 shrink-0">
                      <span className="block text-brand-teal font-bold text-[18px]">
                        -{rec.potentialSavings}kg
                      </span>
                      <span className="text-[12px] text-ink/70 uppercase tracking-wider font-semibold">
                        {rec.difficulty}
                      </span>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-ink/60 text-[15px] font-medium p-6 text-center border-2 border-dashed border-ink/20 rounded-xl bg-canvas/40">
                  Log more activities to get personalized recommendations.
                </div>
              )}
            </div>
          </div>

          {/* Weekly Trend */}
          {weeklyTrend.length > 0 && (
            <div className="col-span-3 md:col-span-1 bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm">
              <h3 className="text-[18px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
                <Target
                  className="w-5 h-5 text-brand-pink"
                  aria-hidden="true"
                />
                Weekly Trend
              </h3>
              <div
                className="h-[200px]"
                role="img"
                aria-label="7-day carbon emission trend"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={weeklyTrend}>
                    <XAxis
                      dataKey="date"
                      tick={{ fontSize: 12, fill: "#6a6a6a" }}
                    />
                    <YAxis hide />
                    <Bar dataKey="value" fill="#14b8a6" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Challenges */}
          <div className="col-span-3 md:col-span-2 bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm">
            <h3 className="text-[18px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
              <Target className="w-5 h-5 text-brand-teal" aria-hidden="true" />
              Challenges
            </h3>
            <div className="grid gap-3">
              {challenges.map((c) => (
                <motion.button
                  key={c.id}
                  onClick={() => toggleChallenge(c.id)}
                  className={`w-full text-left rounded-xl p-4 flex items-center justify-between border transition-all ${
                    c.active
                      ? "bg-brand-teal text-white border-brand-teal"
                      : "bg-canvas text-ink border-hairline hover:border-brand-teal/40"
                  }`}
                  aria-pressed={c.active}
                >
                  <div>
                    <div className="font-semibold text-[15px]">{c.title}</div>
                    <div
                      className={`text-[13px] mt-0.5 ${c.active ? "text-white/80" : "text-muted"}`}
                    >
                      {c.description}
                    </div>
                  </div>
                  <div className="text-right shrink-0 ml-4">
                    {c.active ? (
                      <span className="text-brand-mint font-bold text-[14px]">
                        🔥 {c.streak} day{c.streak !== 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-muted text-[13px] font-medium">
                        Start
                      </span>
                    )}
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Recent Logs */}
          <div className="col-span-3 bg-surface-card rounded-[24px] p-8 border border-hairline shadow-sm">
            <h3 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2 tracking-tight">
              <Map className="w-6 h-6 text-brand-pink" aria-hidden="true" />
              Recent Logs
            </h3>
            <div className="flex flex-col">
              {activities
                .slice()
                .reverse()
                .map((act) => (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    key={act.id}
                    className="flex justify-between items-center py-4 border-b border-hairline last:border-0 hover:bg-surface-strong rounded-xl px-4 -mx-4 transition-colors"
                  >
                    <div>
                      <div className="text-ink font-semibold text-[16px] capitalize">
                        {act.amount}
                        {act.unit} {act.subCategory}
                      </div>
                      <div className="text-muted text-[14px] font-medium mt-1">
                        {act.rawInput || "Quick Log"}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-ink font-semibold text-[16px]">
                        {act.co2e.toFixed(2)} kg
                      </div>
                      <div className="text-muted text-[13px] font-medium">
                        {act.equivalent}
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        </motion.div>
      ) : (
        <div className="py-24 px-6 text-center bg-canvas border border-dashed border-hairline rounded-[24px] max-w-2xl mx-auto shadow-sm">
          <div className="w-20 h-20 bg-surface-soft rounded-full flex items-center justify-center mx-auto mb-6">
            <Leaf className="w-10 h-10 text-muted" aria-hidden="true" />
          </div>
          <h2 className="text-[24px] font-semibold text-ink mb-3">
            No activities logged yet
          </h2>
          <p className="text-muted font-medium text-[16px] mb-8 max-w-md mx-auto">
            Start by typing what you did today in the command palette above,
            like &quot;I drove 15km&quot; or &quot;I ate a burger&quot;. Our AI
            will handle the rest.
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
