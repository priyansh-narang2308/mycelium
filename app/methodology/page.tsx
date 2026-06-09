import { EMISSION_FACTORS, REGION_GRID_FACTORS } from "@/lib/emissions";

export default function MethodologyPage() {
  return (
    <main className="min-h-screen bg-canvas text-body font-sans selection:bg-brand-pink selection:text-white">
      <section className="max-w-4xl mx-auto px-6 py-24">
        <h1 className="text-[56px] font-medium text-ink tracking-[-2px] leading-none mb-4">
          Methodology
        </h1>
        <p className="text-[18px] text-muted max-w-2xl font-medium mb-16 leading-relaxed">
          CarbonKeeper uses peer-reviewed emission factors from the UK
          Department for Environment, Food &amp; Rural Affairs (DEFRA) and the
          Poore &amp; Nemecek 2018 food systems meta-analysis. All calculations
          happen client-side — your data never leaves your browser.
        </p>

        <section className="mb-20">
          <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
            Emission Factors
          </h2>
          {Object.entries(EMISSION_FACTORS).map(([category, items]) => (
            <div key={category} className="mb-10">
              <h3 className="text-[20px] font-semibold text-ink mb-4 capitalize">
                {category}
              </h3>
              <div className="bg-surface-soft border border-hairline rounded-[16px] overflow-hidden shadow-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="border-b border-hairline bg-surface-card">
                      <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                        Activity
                      </th>
                      <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                        Factor
                      </th>
                      <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                        Per Unit
                      </th>
                      <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                        Source
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(items).map(([key, factor]) => (
                      <tr
                        key={key}
                        className="border-b border-hairline last:border-0 hover:bg-canvas/50 transition-colors"
                      >
                        <td className="px-6 py-4 font-semibold text-ink capitalize">
                          {key.replace(/_/g, " ")}
                        </td>
                        <td className="px-6 py-4 text-ink font-mono">
                          {factor.value}
                        </td>
                        <td className="px-6 py-4 text-muted capitalize">
                          {factor.unit}
                        </td>
                        <td className="px-6 py-4 text-muted text-[14px]">
                          {category === "food"
                            ? "Poore & Nemecek 2018"
                            : "UK DEFRA 2024"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </section>

        <section className="mb-20">
          <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
            Regional Grid Adjustments
          </h2>
          <p className="text-muted font-medium mb-8 leading-relaxed">
            Electricity emissions are adjusted based on the carbon intensity of
            the local grid. The global average is 0.40 kg CO₂e per kWh. Regional
            factors scale this baseline.
          </p>
          <div className="bg-surface-soft border border-hairline rounded-[16px] overflow-hidden shadow-sm">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-hairline bg-surface-card">
                  <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                    Region
                  </th>
                  <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                    Adjustment Factor
                  </th>
                  <th className="px-6 py-3 text-[13px] font-bold text-muted uppercase tracking-wider">
                    Effective kg/kWh
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(REGION_GRID_FACTORS).map(([key, region]) => (
                  <tr
                    key={key}
                    className="border-b border-hairline last:border-0 hover:bg-canvas/50 transition-colors"
                  >
                    <td className="px-6 py-4 font-semibold text-ink">
                      {region.label}
                    </td>
                    <td className="px-6 py-4 text-ink font-mono">
                      {region.factor.toFixed(2)}x
                    </td>
                    <td className="px-6 py-4 text-muted font-mono">
                      {(0.4 * region.factor).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
            Calculation Formula
          </h2>
          <div className="bg-ink rounded-[16px] p-8 font-mono text-[15px] text-white leading-relaxed shadow-sm">
            <p className="mb-2">
              <span className="text-brand-mint">emissions</span> ={" "}
              <span className="text-brand-teal">amount</span> &times;{" "}
              <span className="text-brand-peach">factor</span>
            </p>
            <p className="mb-2">
              <span className="text-brand-mint">emissions</span> = kg CO₂e
            </p>
            <p className="text-white/70">
              For electricity: adjusted = factor &times; amount &times;{" "}
              <span className="text-brand-peach">region_multiplier</span>
            </p>
          </div>
        </section>

        <section className="mb-20">
          <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
            Privacy
          </h2>
          <div className="bg-surface-soft border border-hairline rounded-[16px] p-8 shadow-sm">
            <p className="text-muted font-medium leading-relaxed mb-4">
              All emission calculations run in your browser. Your activity data
              is stored in your browser&apos;s localStorage and is never sent to
              any server unless you explicitly use the AI insight or
              recommendation features — in which case only your recent activity
              summaries are sent to Google&apos;s Gemini API.
            </p>
            <p className="text-muted font-medium leading-relaxed">
              No account. No tracking. No data uploads. CarbonKeeper is designed
              to be trustworthy by default.
            </p>
          </div>
        </section>

        <section>
          <h2 className="text-[28px] font-medium text-ink tracking-[-1px] mb-8">
            Sources
          </h2>
          <ul className="space-y-3">
            <li className="bg-surface-soft border border-hairline rounded-[12px] p-5 shadow-sm">
              <p className="font-semibold text-ink">UK Government DEFRA 2024</p>
              <p className="text-muted text-[14px] font-medium mt-1">
                Greenhouse gas reporting: conversion factors 2024. UK Department
                for Energy Security and Net Zero.
              </p>
            </li>
            <li className="bg-surface-soft border border-hairline rounded-[12px] p-5 shadow-sm">
              <p className="font-semibold text-ink">Poore &amp; Nemecek 2018</p>
              <p className="text-muted text-[14px] font-medium mt-1">
                &ldquo;Reducing food&rsquo;s environmental impacts through
                producers and consumers.&rdquo; Science 360(6392): 987-992.
              </p>
            </li>
            <li className="bg-surface-soft border border-hairline rounded-[12px] p-5 shadow-sm">
              <p className="font-semibold text-ink">IPCC AR6 (2021)</p>
              <p className="text-muted text-[14px] font-medium mt-1">
                Regional grid carbon intensity benchmarks derived from the Sixth
                Assessment Report, Working Group III.
              </p>
            </li>
          </ul>
        </section>
      </section>
    </main>
  );
}
