import { Waves, Wind } from "lucide-react";

import type { WindRoseMode } from "../../../constants/wind-rose";

type WindRoseModeToggleProps = {
  mode: WindRoseMode;
  onChange: (mode: WindRoseMode) => void;
};

export default function WindRoseModeToggle({
  mode,
  onChange,
}: WindRoseModeToggleProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-1 shadow-sm">
      <button
        type="button"
        onClick={() => onChange("wind")}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${mode === "wind" ? "bg-sky-600 text-white" : "text-slate-500 hover:text-slate-900"}`}
      >
        <Wind size={16} />
        Wind
      </button>
      <button
        type="button"
        onClick={() => onChange("wave")}
        className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-medium transition ${mode === "wave" ? "bg-sky-600 text-white" : "text-slate-500 hover:text-slate-900"}`}
      >
        <Waves size={16} />
        Wave
      </button>
    </div>
  );
}
