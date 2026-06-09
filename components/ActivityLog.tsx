"use client";
import { useState } from "react";
import { useStore } from "@/lib/store";
import { motion } from "framer-motion";
import { Terminal, Send } from "lucide-react";
import { toast } from "sonner";
import { calculateActivityEmissions } from "@/lib/agents/calculator";


async function parseActivity(input: string, region: string, headers: Record<string, string>) {
  const res = await fetch("/api/parse", {
    method: "POST",
    headers,
    body: JSON.stringify({ input, region }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error || "Failed to parse input");
  }
  return res.json();
}

function buildActivity(rawInput: string, parsed: { category: string; subCategory: string; amount: number }, region: string) {
  const data = calculateActivityEmissions(parsed.category, parsed.subCategory, parsed.amount, rawInput, region);
  return { id: Date.now().toString(), timestamp: new Date().toISOString(), ...data };
}

async function fetchAIFeedback(
  history: import("@/lib/types").Activity[],
  region: string,
  budget: number,
  headers: Record<string, string>,
  onRecommendations: (recs: import("@/lib/types").Recommendation[]) => void,
  onInsight: (insight: string) => void,
) {
  try {
    const [recRes, insRes] = await Promise.all([
      fetch("/api/recommend", {
        method: "POST",
        headers,
        body: JSON.stringify({ history, region }),
      }),
      fetch("/api/insight", {
        method: "POST",
        headers,
        body: JSON.stringify({ history, budget, region }),
      }),
    ]);
    if (recRes.ok) {
      const data = await recRes.json();
      if (data.recommendations?.length) onRecommendations(data.recommendations);
    }
    if (insRes.ok) {
      const data = await insRes.json();
      if (data.insight) onInsight(data.insight);
    }
  } catch {
    // Background AI failures are non-critical
  }
}

export function ActivityLog() {
  const [input, setInput] = useState("");
  const { activities, addActivity, setRecommendations, setInsight, setIsProcessing, isProcessing, region, dailyBudget } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    const rawInput = input;
    setInput("");

    try {
      const headers = { "Content-Type": "application/json" };
      const parsed = await parseActivity(rawInput, region, headers);
      const activity = buildActivity(rawInput, parsed, region);
      addActivity(activity);

      const updatedHistory = [...activities, activity];
      fetchAIFeedback(updatedHistory, region, dailyBudget, headers, setRecommendations, setInsight);
      toast.success("Activity logged and analyzed!");
    } catch {
      setInput(rawInput);
      toast.error("Failed to process your activity. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="w-full max-w-2xl rounded-2xl bg-canvas border border-hairline overflow-hidden shadow-sm">
      <div className="p-4 border-b border-hairline flex items-center gap-3 bg-surface-soft">
        <Terminal className="w-5 h-5 text-muted" aria-hidden="true" />
        <h3 className="text-ink font-semibold text-[16px]">Log Activity</h3>
      </div>
      <form onSubmit={handleSubmit} className="relative bg-canvas">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. I drove 12km today..."
          aria-label="Activity input"
          className="w-full bg-transparent text-ink px-6 py-5 outline-none placeholder:text-muted text-[18px] font-medium"
          disabled={isProcessing}
        />
        <div aria-live="polite" aria-atomic="true" className="sr-only">
          {isProcessing ? "Processing your activity" : ""}
        </div>
        <button
          type="submit"
          aria-label={isProcessing ? "Processing" : "Submit activity"}
          disabled={!input.trim() || isProcessing}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary text-on-primary hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            <Send className="w-5 cursor-pointer h-5" aria-hidden="true" />
          )}
        </button>
      </form>
    </div>
  );
}
