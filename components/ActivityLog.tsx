"use client";
import { useState } from "react";
import { useStore } from "../lib/store";
import { motion } from "framer-motion";
import { Terminal, Send } from "lucide-react";

export function ActivityLog() {
  const [input, setInput] = useState("");
  const { activities, addActivity, setRecommendations, setInsight, setIsProcessing, isProcessing } = useStore();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;
    
    setIsProcessing(true);
    const rawInput = input;
    setInput("");

    try {
      const response = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ input: { raw: rawInput }, history: activities, budget: 10 }),
      });
      
      if (!response.ok) throw new Error("Failed");
      const data = await response.json();
      
      addActivity(data.activity);
      if (data.recommendations?.length) setRecommendations(data.recommendations);
      if (data.insight) setInsight(data.insight);
      
    } catch (err) {
      console.error(err);
      setInput(rawInput);
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
          className="w-full bg-transparent text-ink px-6 py-5 outline-none placeholder:text-muted text-[18px] font-medium"
          disabled={isProcessing}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || isProcessing}
          className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-xl bg-primary text-on-primary hover:opacity-90 disabled:opacity-50 transition-colors"
        >
          {isProcessing ? <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="w-5 h-5 border-2 border-white border-t-transparent rounded-full" /> : <Send className="w-5 h-5" />}
        </button>
      </form>
    </div>
  );
}
