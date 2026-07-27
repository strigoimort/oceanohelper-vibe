import type { WindRoseAnalysis } from "../../../utils/wind-rose";

type WindRoseStatisticsPanelProps = {
  analysis: WindRoseAnalysis;
  mode: "wind" | "wave";
};

export default function WindRoseStatisticsPanel({
  analysis,
  mode,
}: WindRoseStatisticsPanelProps) {
  const magnitudeLabel = mode === "wind" ? "Mean speed" : "Mean height";
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <h3 className="text-base font-semibold text-slate-900">
        Summary statistics
      </h3>
      <div className="mt-4 space-y-3 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Observations</span>
          <span className="font-semibold text-slate-900">
            {analysis.stats.observationCount}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Dominant direction</span>
          <span className="font-semibold text-slate-900">
            {analysis.stats.dominantDirection?.toFixed(1) ?? "—"}°
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Mean direction</span>
          <span className="font-semibold text-slate-900">
            {analysis.stats.meanDirection.toFixed(1)}°
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>{magnitudeLabel}</span>
          <span className="font-semibold text-slate-900">
            {analysis.stats.meanMagnitude.toFixed(2)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Min</span>
          <span className="font-semibold text-slate-900">
            {analysis.stats.minMagnitude?.toFixed(2) ?? "—"}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span>Max</span>
          <span className="font-semibold text-slate-900">
            {analysis.stats.maxMagnitude?.toFixed(2) ?? "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
