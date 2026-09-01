import { ChevronDown } from "lucide-react";

import { BEAUFORT_SCALE } from "../../../constants/wind-rose";

type WindRoseBeaufortTableProps = { mode: "wind" | "wave" };

export default function WindRoseBeaufortTable({ mode }: WindRoseBeaufortTableProps) {
  if (mode !== "wind") return null;

  return <details className="group col-span-12 min-w-0 rounded-2xl border border-slate-200 bg-white shadow-sm">
    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 [&::-webkit-details-marker]:hidden">
      <div>
        <h3 className="text-base font-semibold text-slate-900">Beaufort Scale reference</h3>
        <p className="text-xs text-slate-400">Mode: Wind · Unit: m/s</p>
      </div>
      <ChevronDown size={16} className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
    </summary>
    <div className="panel-scroll grid max-h-72 grid-cols-2 gap-2 overflow-y-auto border-t border-slate-100 p-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
      {BEAUFORT_SCALE.map((entry) => <div key={entry.number} className="min-w-0 rounded-xl bg-slate-50 p-3">
        <p className="truncate text-xs text-slate-400">{entry.number} · {entry.label}</p>
        <p className="mt-1 text-sm font-medium text-slate-800">{entry.maxSpeed === Number.POSITIVE_INFINITY ? `≥ ${entry.minSpeed}` : `${entry.minSpeed}–${entry.maxSpeed}`}</p>
      </div>)}
    </div>
  </details>;
}
