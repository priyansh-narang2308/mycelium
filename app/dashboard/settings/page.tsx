"use client";
import { Settings2, Key, Database, Globe } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useStore } from "../../../lib/store";
import { REGION_GRID_FACTORS, DEFAULT_REGION } from "../../../lib/emissions";
import type { JSX } from "react";

export default function SettingsPage(): JSX.Element {
  const setDailyBudget = useStore((s) => s.setDailyBudget);
  const setRegion = useStore((s) => s.setRegion);
  const [apiKey, setApiKey] = useState("");
  const [budget, setBudget] = useState("10");
  const [region, setRegionLocal] = useState(
    typeof window !== "undefined"
      ? localStorage.getItem("CARBON_REGION") || DEFAULT_REGION
      : DEFAULT_REGION,
  );

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (apiKey) {
      localStorage.setItem("GEMINI_API_KEY", apiKey);
    }
    const budgetNum = parseFloat(budget);
    if (!isNaN(budgetNum) && budgetNum > 0) {
      localStorage.setItem("CARBON_BUDGET", budget);
      setDailyBudget(budgetNum);
    }
    localStorage.setItem("CARBON_REGION", region);
    setRegion(region);
    toast.success("Settings saved successfully!");
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <header className="mb-12">
        <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2 flex items-center gap-3">
          <Settings2 className="w-8 h-8 text-muted" />
          Settings
        </h1>
        <p className="text-muted font-medium">
          Manage your app preferences and API configuration.
        </p>
      </header>

      <form onSubmit={handleSave} className="space-y-8">
        <section className="bg-canvas border border-hairline rounded-[24px] p-8 shadow-sm">
          <h2 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2">
            <Database className="w-5 h-5 text-brand-teal" />
            Preferences
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[15px] font-semibold text-ink mb-2">
                Daily Carbon Budget (kg CO₂e)
              </label>
              <p className="text-[14px] text-muted font-medium mb-3">
                Set your target maximum emissions for a single day.
              </p>
              <input
                type="number"
                value={budget}
                onChange={(e) => setBudget(e.target.value)}
                className="w-full max-w-md bg-surface-soft border border-hairline rounded-xl px-4 py-3 text-ink font-medium focus:outline-none focus:border-brand-teal transition-colors"
              />
            </div>

            <div>
              <label className="block text-[15px] font-semibold text-ink mb-2">
                <Globe className="w-4 h-4 inline mr-1.5 -mt-0.5" />
                Region / Grid Context
              </label>
              <p className="text-[14px] text-muted font-medium mb-3">
                Your local electricity grid mix affects your carbon footprint.
                Select your region for personalized calculations.
              </p>
              <select
                value={region}
                onChange={(e) => setRegionLocal(e.target.value)}
                className="w-full max-w-md bg-surface-soft border border-hairline rounded-xl px-4 py-3 text-ink font-medium focus:outline-none focus:border-brand-teal transition-colors"
              >
                {Object.entries(REGION_GRID_FACTORS).map(([key, { label }]) => (
                  <option key={key} value={key}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </section>

        <section className="bg-canvas border border-hairline rounded-[24px] p-8 shadow-sm">
          <h2 className="text-[20px] font-semibold text-ink mb-6 flex items-center gap-2">
            <Key className="w-5 h-5 text-brand-pink" />
            AI Configuration (Hackathon Override)
          </h2>
          <div className="space-y-6">
            <div>
              <label className="block text-[15px] font-semibold text-ink mb-2">
                Gemini API Key
              </label>
              <p className="text-[14px] text-muted font-medium mb-3">
                If you are a judge reviewing this project locally, you can plug
                in your own Gemini API key here to test the AI features
                dynamically.
              </p>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-surface-soft border border-hairline rounded-xl px-4 py-3 text-ink font-medium focus:outline-none focus:border-brand-pink transition-colors font-mono"
              />
            </div>
          </div>
        </section>

        <div className="flex justify-end">
          <button
            type="submit"
            className="px-8 py-4 bg-ink text-canvas rounded-xl font-bold text-[16px] hover:opacity-90 transition-opacity shadow-sm"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
