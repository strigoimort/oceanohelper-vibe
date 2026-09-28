import type { ReactNode } from "react";

import Card from "../../../components/ui/card";
import type { WindRoseMode } from "../../../constants/wind-rose";
import {
  hasActiveFilters,
  type WindRoseFilters,
} from "../../../utils/wind-rose";

type WindRoseFilterPanelProps = {
  mode: WindRoseMode;
  filters: WindRoseFilters;
  onFiltersChange: (filters: WindRoseFilters) => void;
  onReset: () => void;
};

const INPUT_CLASS =
  "mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none";

export default function WindRoseFilterPanel({
  mode,
  filters,
  onFiltersChange,
  onReset,
}: WindRoseFilterPanelProps) {
  const update = (patch: Partial<WindRoseFilters>) =>
    onFiltersChange({ ...filters, ...patch });

  return (
    <Card>
      <div className="mb-4 flex items-center justify-between gap-3">
        <h3 className="text-base font-semibold text-ink">Filters</h3>
        <button
          type="button"
          onClick={onReset}
          disabled={!hasActiveFilters(filters)}
          className="text-xs font-medium text-accent hover:text-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          Reset
        </button>
      </div>

      <div className="space-y-4">
        <FieldGroup title="Date range">
          <DateField
            label="From"
            value={filters.dateFrom}
            onChange={(value) => update({ dateFrom: value })}
          />
          <DateField
            label="To"
            value={filters.dateTo}
            onChange={(value) => update({ dateTo: value })}
          />
        </FieldGroup>

        <FieldGroup title={mode === "wind" ? "Speed (m/s)" : "Height (m)"}>
          <NumberField
            label="Min"
            min={0}
            value={filters.magnitudeMin}
            onChange={(value) => update({ magnitudeMin: value })}
          />
          <NumberField
            label="Max"
            min={0}
            value={filters.magnitudeMax}
            onChange={(value) => update({ magnitudeMax: value })}
          />
        </FieldGroup>

        <FieldGroup
          title="Direction (°)"
          hint="Set From higher than To to wrap through north, e.g. 315 → 45."
        >
          <NumberField
            label="From"
            min={0}
            max={360}
            value={filters.directionFrom}
            onChange={(value) => update({ directionFrom: value })}
          />
          <NumberField
            label="To"
            min={0}
            max={360}
            value={filters.directionTo}
            onChange={(value) => update({ directionTo: value })}
          />
        </FieldGroup>
      </div>
    </Card>
  );
}

type FieldGroupProps = {
  title: string;
  hint?: string;
  children: ReactNode;
};

function FieldGroup({ title, hint, children }: FieldGroupProps) {
  return (
    <div>
      <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
        {title}
      </p>
      <div className="grid grid-cols-2 gap-3">{children}</div>
      {hint && <p className="mt-1.5 text-xs text-slate-400">{hint}</p>}
    </div>
  );
}

type DateFieldProps = {
  label: string;
  value: string | null;
  onChange: (value: string | null) => void;
};

function DateField({ label, value, onChange }: DateFieldProps) {
  return (
    <label className="block min-w-0 text-xs font-medium text-slate-500">
      {label}
      <input
        type="date"
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className={INPUT_CLASS}
      />
    </label>
  );
}

type NumberFieldProps = {
  label: string;
  value: number | null;
  min?: number;
  max?: number;
  onChange: (value: number | null) => void;
};

function NumberField({ label, value, min, max, onChange }: NumberFieldProps) {
  return (
    <label className="block min-w-0 text-xs font-medium text-slate-500">
      {label}
      <input
        type="number"
        inputMode="decimal"
        step="any"
        min={min}
        max={max}
        value={value ?? ""}
        placeholder="Any"
        onChange={(event) =>
          onChange(
            event.target.value === "" ? null : Number(event.target.value),
          )
        }
        className={INPUT_CLASS}
      />
    </label>
  );
}
