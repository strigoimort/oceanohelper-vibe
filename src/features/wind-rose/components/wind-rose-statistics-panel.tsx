import type { WindRoseAnalysis } from "../../../utils/wind-rose";

type WindRoseStatisticsPanelProps = { analysis: WindRoseAnalysis; mode: "wind" | "wave" };

export default function WindRoseStatisticsPanel({ analysis, mode }: WindRoseStatisticsPanelProps) {
  const magnitudeLabel = mode === "wind" ? "Mean speed" : "Mean height";
  const metrics = [
    ["Observations", analysis.stats.observationCount],
    ["Dominant dir.", `${analysis.stats.dominantDirection?.toFixed(1) ?? "—"}°`],
    ["Mean dir.", `${analysis.stats.meanDirection.toFixed(1)}°`],
    [magnitudeLabel, analysis.stats.meanMagnitude.toFixed(2)],
    ["Min", analysis.stats.minMagnitude?.toFixed(2) ?? "—"],
    ["Max", analysis.stats.maxMagnitude?.toFixed(2) ?? "—"],
  ];

  return <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <h3 className="text-base font-semibold text-slate-900">Summary statistics</h3>
    <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {metrics.map(([label, value]) => <div key={label} className="min-w-0 rounded-xl bg-slate-50 p-3">
        <p className="text-xs text-slate-500">{label}</p>
        <p className="mt-1 truncate text-lg font-semibold text-slate-900">{value}</p>
      </div>)}
    </div>
  </section>;
}
