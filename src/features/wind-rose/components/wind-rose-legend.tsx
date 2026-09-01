import type { WindRoseAnalysis } from "../../../utils/wind-rose";

type WindRoseLegendProps = { analysis: WindRoseAnalysis; mode: "wind" | "wave" };

const COLORS = ["#38bdf8", "#0ea5e9", "#14b8a6", "#f59e0b", "#f97316", "#ef4444"];

export default function WindRoseLegend({ analysis, mode }: WindRoseLegendProps) {
  return <div className="w-full min-w-0 lg:w-44 lg:shrink-0">
    <h4 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">{mode === "wind" ? "Speed class (m/s)" : "Height class (m)"}</h4>
    <div className="mt-3 space-y-1.5">
      {analysis.classLabels.map((label, index) => <div key={`${label}-${index}`} className="flex min-w-0 items-center gap-2 text-sm text-slate-600">
        <span className="size-2.5 shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
        <span className="truncate">{label}</span>
      </div>)}
    </div>
  </div>;
}
