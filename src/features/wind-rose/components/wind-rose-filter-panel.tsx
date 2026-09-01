import { ChevronDown } from "lucide-react";

import type { WindRoseFilters } from "../../../utils/wind-rose";
import { DEFAULT_SECTOR_COUNT, SECTOR_OPTIONS, type WindRoseMode } from "../../../constants/wind-rose";

type WindRoseFilterPanelProps = {
  mode: WindRoseMode;
  filters: WindRoseFilters;
  sectorCount: number;
  breakpoints: number[];
  onFiltersChange: (filters: WindRoseFilters) => void;
  onSectorCountChange: (sectorCount: number) => void;
  onBreakpointsChange: (breakpoints: number[]) => void;
  onReset: () => void;
};

export default function WindRoseFilterPanel({ mode, filters, sectorCount, breakpoints, onFiltersChange, onSectorCountChange, onBreakpointsChange, onReset }: WindRoseFilterPanelProps) {
  const handleBreakpointChange = (index: number, value: string) => {
    const nextBreakpoints = [...breakpoints];
    nextBreakpoints[index] = Number(value);
    onBreakpointsChange(nextBreakpoints.filter((point) => Number.isFinite(point) && point >= 0).sort((left, right) => left - right));
  };

  const updateRange = (field: "magnitudeRange" | "directionRange", value: string) => {
    const [lower, upper] = value.split(",");
    onFiltersChange({ ...filters, [field]: [Number(lower), Number(upper)] });
  };

  return <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
    <div className="mb-4 flex min-w-0 items-center justify-between gap-3">
      <h3 className="text-base font-semibold text-slate-900">Filters &amp; settings</h3>
      <button type="button" onClick={onReset} className="text-xs font-medium text-sky-600 hover:text-sky-700">Reset</button>
    </div>

    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      <label className="block min-w-0 text-xs font-medium text-slate-500">Date from
        <input type="date" value={filters.dateFrom ?? ""} onChange={(event) => onFiltersChange({ ...filters, dateFrom: event.target.value || null })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none" />
      </label>
      <label className="block min-w-0 text-xs font-medium text-slate-500">Date to
        <input type="date" value={filters.dateTo ?? ""} onChange={(event) => onFiltersChange({ ...filters, dateTo: event.target.value || null })} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none" />
      </label>
      <label className="block min-w-0 text-xs font-medium text-slate-500">{mode === "wind" ? "Speed range (m/s)" : "Height range (m)"}
        <input type="text" value={`${filters.magnitudeRange[0]},${filters.magnitudeRange[1]}`} onChange={(event) => updateRange("magnitudeRange", event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none" />
      </label>
      <label className="block min-w-0 text-xs font-medium text-slate-500">Direction range (°)
        <input type="text" value={`${filters.directionRange[0]},${filters.directionRange[1]}`} onChange={(event) => updateRange("directionRange", event.target.value)} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none" />
      </label>
      <label className="block min-w-0 text-xs font-medium text-slate-500 sm:col-span-2">Direction sectors
        <select value={sectorCount} onChange={(event) => onSectorCountChange(Number(event.target.value))} className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none">
          {[DEFAULT_SECTOR_COUNT, ...SECTOR_OPTIONS.filter((option) => option !== DEFAULT_SECTOR_COUNT)].map((option) => <option key={option} value={option}>{option}</option>)}
          <option value="custom">Custom</option>
        </select>
      </label>
    </div>

    <details className="group mt-4 rounded-xl border border-slate-200">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-3 py-2.5 text-sm font-medium text-slate-700 [&::-webkit-details-marker]:hidden">
        <span>Edit magnitude breakpoints</span>
        <ChevronDown size={16} className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180" />
      </summary>
      <div className="border-t border-slate-100">
        <div className="panel-scroll mt-2 max-h-72 overflow-y-auto px-3 py-1 pr-1">
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {breakpoints.map((breakpoint, index) => <label key={`${breakpoint}-${index}`} className="min-w-0 text-[11px] text-slate-400">Class {index + 1}
              <input type="number" value={breakpoint} onChange={(event) => handleBreakpointChange(index, event.target.value)} className="mt-1 w-full rounded-lg bg-slate-50 px-2 py-1.5 text-center text-sm text-slate-700 outline-none ring-1 ring-inset ring-slate-200 focus:ring-sky-500" />
            </label>)}
          </div>
        </div>
      </div>
    </details>
  </section>;
}
