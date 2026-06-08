"use client";
import { useState } from "react";
import { useStore } from "../lib/store";
import { motion } from "framer-motion";
import { Terminal, Send } from "lucide-react";
import { toast } from "sonner";
import { calculateActivityEmissions } from "../lib/agents/calculator";

export function ActivityLog() {
  const [input, setInput] = useState("");
  const {
    activities,
    addActivity,
    setRecommendations,
    setInsight,
    setIsProcessing,
    isProcessing,
    region,
  } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    setIsProcessing(true);
    const rawInput = input;
    setInput("");

    try {
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };
      // 1. Parse Input
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers,
        body: JSON.stringify({ input: rawInput, region }),
      });
      if (!parseRes.ok) throw new Error("Failed to parse");
      const parsed = await parseRes.json();

      if (
        !parsed.category ||
        !parsed.subCategory ||
        parsed.amount === undefined
      ) {
        throw new Error("Could not understand input.");
      }

      // 2. Synchronous UI Update
      const newActivityData = calculateActivityEmissions(
        parsed.category,
        parsed.subCategory,
        parsed.amount,
        rawInput,
        region,
      );
      const newActivity = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...newActivityData,
      };
      addActivity(newActivity);

      // 3. Background AI Tasks (Recommendations & Insights)
      const updatedHistory = [...activities, newActivity];
      const budget = parseFloat(localStorage.getItem("CARBON_BUDGET") || "10");

      try {
        const [recRes, insRes] = await Promise.all([
          fetch("/api/recommend", {
            method: "POST",
            headers,
            body: JSON.stringify({ history: updatedHistory, region }),
          }),
          fetch("/api/insight", {
            method: "POST",
            headers,
            body: JSON.stringify({ history: updatedHistory, budget, region }),
          }),
        ]);

        if (recRes.ok) {
          const recData = await recRes.json();
          if (recData.recommendations?.length) setRecommendations(recData.recommendations);
        }
        if (insRes.ok) {
          const insData = await insRes.json();
          if (insData.insight) setInsight(insData.insight);
        }
      } catch {
        // Background AI failures are non-critical — activity is already logged
      }

      toast.success("Activity logged and analyzed!");
    } catch (err) {
      console.error(err);
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
