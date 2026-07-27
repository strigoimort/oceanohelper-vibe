import type { WindRoseAnalysis } from "../../../utils/wind-rose";

type WindRoseLegendProps = {
  analysis: WindRoseAnalysis;
  mode: "wind" | "wave";
};

const COLORS = ["#0f766e", "#0ea5e9", "#6366f1", "#f59e0b", "#ef4444"];

export default function WindRoseLegend({
  analysis,
  mode,
}: WindRoseLegendProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
      <h4 className="text-sm font-semibold text-slate-900">
        {mode === "wind" ? "Wind speed classes" : "Wave height classes"}
      </h4>
      <div className="mt-3 space-y-2">
        {analysis.classLabels.map((label, index) => (
          <div
            key={`${label}-${index}`}
            className="flex items-center justify-between text-sm text-slate-600"
          >
            <span className="flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full"
                style={{ backgroundColor: COLORS[index % COLORS.length] }}
              />
              {label}
            </span>
            <span>
              {analysis.sectors.reduce(
                (total, sector) => total + sector.classes[index].count,
                0,
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
