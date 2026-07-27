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
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-1">
      <button
        type="button"
        onClick={() => onChange("wind")}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${mode === "wind" ? "bg-white text-sky-700 shadow-sm" : "text-slate-600"}`}
      >
        <Wind size={16} />
        Wind
      </button>
      <button
        type="button"
        onClick={() => onChange("wave")}
        className={`inline-flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition ${mode === "wave" ? "bg-white text-sky-700 shadow-sm" : "text-slate-600"}`}
      >
        <Waves size={16} />
        Wave
      </button>
    </div>
  );
}
