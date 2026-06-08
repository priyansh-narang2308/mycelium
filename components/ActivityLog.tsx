"use client";
import { useState } from "react";
import { useStore } from "../lib/store";
import { motion } from "framer-motion";
import { Terminal, Send } from "lucide-react";
import { toast } from "sonner";
import { calculateActivityEmissions } from "../lib/agents/calculator";

export function ActivityLog() {
  const [input, setInput] = useState("");
  const { activities, addActivity, setRecommendations, setInsight, setIsProcessing, isProcessing, region } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const rawInput = input;
    setInput("");

    try {
      const apiKeyOverride = localStorage.getItem("GEMINI_API_KEY");
      const headers: Record<string, string> = { "Content-Type": "application/json" };
      if (apiKeyOverride && apiKeyOverride.trim() !== "") {
        headers["x-api-key"] = apiKeyOverride;
      }

      // 1. Parse Input
      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers,
        body: JSON.stringify({ input: rawInput, region }),
      });
      if (!parseRes.ok) throw new Error("Failed to parse");
      const parsed = await parseRes.json();

      if (!parsed.category || !parsed.subCategory || parsed.amount === undefined) {
        throw new Error("Could not understand input.");
      }

      // 2. Synchronous UI Update
      const newActivityData = calculateActivityEmissions(parsed.category, parsed.subCategory, parsed.amount, rawInput, region);
      const newActivity = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...newActivityData
      };
      addActivity(newActivity);

      // 3. Background AI Tasks (Recommendations & Insights)
      const updatedHistory = [...activities, newActivity];
      const budget = parseFloat(localStorage.getItem("CARBON_BUDGET") || "10");

      await Promise.all([
        fetch("/api/recommend", {
          method: "POST",
          headers,
          body: JSON.stringify({ history: updatedHistory, region }),
        }).then(res => res.json()).then(data => {
          if (data.recommendations?.length) setRecommendations(data.recommendations);
        }).catch(console.error),

        fetch("/api/insight", {
          method: "POST",
          headers,
          body: JSON.stringify({ history: updatedHistory, budget, region }),
        }).then(res => res.json()).then(data => {
          if (data.insight) setInsight(data.insight);
        }).catch(console.error)
      ]);

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
        <Terminal className="w-5 h-5 text-muted" />
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
        <button 
          type="submit" 
          aria-label="Submit activity"
          disabled={!input.trim() || isProcessing}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary text-on-primary hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
