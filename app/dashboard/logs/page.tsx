"use client";
import { useStore } from "../../../lib/store";
import { format } from "date-fns";
import { Trash2, FileText } from "lucide-react";

export default function LogsPage() {
  const { activities, clearActivities } = useStore();

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <header className="mb-12 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-[40px] font-medium text-ink tracking-[-1.0px] mb-2">
            Activity Logs
          </h1>
          <p className="text-muted font-medium">
            A complete history of every carbon-emitting activity you have
            logged.
          </p>
        </div>
        {activities.length > 0 && (
          <button
            onClick={clearActivities}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-surface-strong text-ink font-semibold hover:bg-brand-pink hover:text-white transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear Data
          </button>
        )}
      </header>

      {activities.length > 0 ? (
        <div className="bg-canvas border border-hairline rounded-[24px] overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-surface-soft border-b border-hairline text-muted font-semibold text-[14px]">
                  <th className="p-4 pl-6 whitespace-nowrap">Date</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Raw Input</th>
                  <th className="p-4 text-right">Amount</th>
                  <th className="p-4 text-right">CO₂e (kg)</th>
                  <th className="p-4 pr-6">Global Equivalent</th>
                </tr>
              </thead>
              <tbody>
                {activities
                  .slice()
                  .reverse()
                  .map((act) => (
                    <tr
                      key={act.id}
                      className="border-b border-hairline last:border-0 hover:bg-surface-soft/50 transition-colors"
                    >
                      <td className="p-4 pl-6 whitespace-nowrap text-muted text-[14px] font-medium">
                        {format(new Date(act.timestamp), "MMM d, yyyy HH:mm")}
                      </td>
                      <td className="p-4 font-semibold text-ink text-[15px] capitalize">
                        {act.category} &rsaquo; {act.subCategory}
                      </td>
                      <td
                        className="p-4 text-muted text-[14px] font-medium max-w-[200px] truncate"
                        title={act.rawInput || "Manual entry"}
                      >
                        {act.rawInput || "Manual entry"}
                      </td>
                      <td className="p-4 text-right font-semibold text-ink text-[15px]">
                        {act.amount} {act.unit}
                      </td>
                      <td className="p-4 text-right font-bold text-brand-teal text-[16px]">
                        {act.co2e.toFixed(2)}
                      </td>
                      <td
                        className="p-4 pr-6 text-muted text-[13px] font-medium max-w-[200px] truncate"
                        title={act.equivalent}
                      >
                        {act.equivalent}
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="py-24 text-center bg-canvas border border-dashed border-hairline rounded-[24px]">
          <FileText className="w-16 h-16 text-muted mx-auto mb-4 opacity-50" />
          <h3 className="text-[20px] font-semibold text-ink mb-2">
            No logs found
          </h3>
          <p className="text-muted font-medium text-[16px]">
            Head over to the Overview page to start logging activities.
          </p>
        </div>
      )}
    </div>
  );
}
