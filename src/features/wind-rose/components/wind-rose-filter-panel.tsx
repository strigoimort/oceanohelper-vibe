import type { WindRoseFilters } from "../../../utils/wind-rose";
import {
  DEFAULT_SECTOR_COUNT,
  SECTOR_OPTIONS,
  type WindRoseMode,
} from "../../../constants/wind-rose";

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

export default function WindRoseFilterPanel({
  mode,
  filters,
  sectorCount,
  breakpoints,
  onFiltersChange,
  onSectorCountChange,
  onBreakpointsChange,
  onReset,
}: WindRoseFilterPanelProps) {
  const handleBreakpointChange = (index: number, value: string) => {
    const nextBreakpoints = [...breakpoints];
    nextBreakpoints[index] = Number(value);
    onBreakpointsChange(
      nextBreakpoints
        .filter((point) => Number.isFinite(point) && point >= 0)
        .sort((left, right) => left - right),
    );
  };

  const updateRange = (field: keyof WindRoseFilters, value: string) => {
    const next = { ...filters, [field]: value };
    if (field === "magnitudeRange") {
      const [lower, upper] = (value as string).split(",");
      next[field] = [Number(lower), Number(upper)] as [number, number];
    }
    if (field === "directionRange") {
      const [lower, upper] = (value as string).split(",");
      next[field] = [Number(lower), Number(upper)] as [number, number];
    }
    onFiltersChange(next as WindRoseFilters);
  };

  return (
    <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-semibold text-slate-900">
          Filters & settings
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-sky-600"
        >
          Reset
        </button>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-slate-600">
          <span className="mb-1 block font-medium text-slate-900">
            Date from
          </span>
          <input
            type="date"
            value={filters.dateFrom ?? ""}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                dateFrom: event.target.value || null,
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-slate-600">
          <span className="mb-1 block font-medium text-slate-900">Date to</span>
          <input
            type="date"
            value={filters.dateTo ?? ""}
            onChange={(event) =>
              onFiltersChange({
                ...filters,
                dateTo: event.target.value || null,
              })
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-slate-600">
          <span className="mb-1 block font-medium text-slate-900">
            Magnitude range
          </span>
          <input
            type="text"
            value={`${filters.magnitudeRange[0]},${filters.magnitudeRange[1]}`}
            onChange={(event) =>
              updateRange("magnitudeRange", event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
        <label className="block text-sm text-slate-600">
          <span className="mb-1 block font-medium text-slate-900">
            Direction range
          </span>
          <input
            type="text"
            value={`${filters.directionRange[0]},${filters.directionRange[1]}`}
            onChange={(event) =>
              updateRange("directionRange", event.target.value)
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          />
        </label>
      </div>

      <div className="space-y-3">
        <label className="block text-sm text-slate-600">
          <span className="mb-1 block font-medium text-slate-900">
            Direction sectors
          </span>
          <select
            value={sectorCount}
            onChange={(event) =>
              onSectorCountChange(Number(event.target.value))
            }
            className="w-full rounded-lg border border-slate-200 px-3 py-2"
          >
            {[
              DEFAULT_SECTOR_COUNT,
              ...SECTOR_OPTIONS.filter(
                (option) => option !== DEFAULT_SECTOR_COUNT,
              ),
            ].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
            <option value="custom">Custom</option>
          </select>
        </label>

        <div className="rounded-xl border border-slate-200 p-3">
          <p className="text-sm font-medium text-slate-900">
            Magnitude breakpoints
          </p>
          <p className="mb-3 text-xs text-slate-500">
            {mode === "wind"
              ? "Beaufort-based defaults, editable for custom bins."
              : "Wave height class breakpoints"}
          </p>
          <div className="space-y-2">
            {breakpoints.map((breakpoint, index) => (
              <input
                key={`${breakpoint}-${index}`}
                type="number"
                value={breakpoint}
                onChange={(event) =>
                  handleBreakpointChange(index, event.target.value)
                }
                className="w-full rounded-lg border border-slate-200 px-3 py-2 text-sm"
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
