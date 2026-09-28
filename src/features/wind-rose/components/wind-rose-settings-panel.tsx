import { useState } from "react";

import Card from "../../../components/ui/card";
import {
  SECTOR_OPTIONS,
  type WindRoseMode,
} from "../../../constants/wind-rose";
import { parseBreakpoints } from "../../../utils/wind-rose";

type WindRoseSettingsPanelProps = {
  mode: WindRoseMode;
  sectorCount: number;
  breakpoints: number[];
  onSectorCountChange: (sectorCount: number) => void;
  onBreakpointsChange: (breakpoints: number[]) => void;
  onReset: () => void;
};

export default function WindRoseSettingsPanel({
  mode,
  sectorCount,
  breakpoints,
  onSectorCountChange,
  onBreakpointsChange,
  onReset,
}: WindRoseSettingsPanelProps) {
  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">Chart settings</h3>
        <button
          type="button"
          onClick={onReset}
          className="text-xs font-medium text-accent hover:text-accent-hover"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <div>
          <p className="text-xs font-medium text-slate-500">
            Direction sectors
          </p>
          <div
            className="mt-1 inline-flex rounded-xl border border-slate-200 bg-white p-1"
            role="group"
            aria-label="Direction sectors"
          >
            {SECTOR_OPTIONS.map((option) => (
              <button
                key={option}
                type="button"
                aria-pressed={option === sectorCount}
                onClick={() => onSectorCountChange(option)}
                className={`rounded-lg px-3 py-1.5 text-sm font-medium transition ${
                  option === sectorCount
                    ? "bg-accent text-white"
                    : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {option}
              </button>
            ))}
          </div>
        </div>

        <BreakpointField
          key={breakpoints.join(",")}
          breakpoints={breakpoints}
          unit={mode === "wind" ? "m/s" : "m"}
          onCommit={onBreakpointsChange}
        />
      </div>
    </Card>
  );
}

type BreakpointFieldProps = {
  breakpoints: number[];
  unit: string;
  onCommit: (breakpoints: number[]) => void;
};

function BreakpointField({
  breakpoints,
  unit,
  onCommit,
}: BreakpointFieldProps) {
  const [draft, setDraft] = useState(breakpoints.join(", "));

  const commit = () => {
    const parsed = parseBreakpoints(draft);

    if (parsed.length === 0) {
      setDraft(breakpoints.join(", "));
      return;
    }

    setDraft(parsed.join(", "));
    onCommit(parsed);
  };

  return (
    <label className="block text-xs font-medium text-slate-500">
      Class upper bounds ({unit})
      <input
        type="text"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commit}
        onKeyDown={(event) => {
          if (event.key === "Enter") event.currentTarget.blur();
        }}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none"
      />
      <span className="mt-1 block font-normal text-slate-400">
        Separate with commas, use a dot for decimals. {breakpoints.length + 1}{" "}
        classes.
      </span>
    </label>
  );
}
