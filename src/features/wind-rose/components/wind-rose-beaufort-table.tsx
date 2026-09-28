import { ChevronDown } from "lucide-react";

import Card from "../../../components/ui/card";
import StatTile from "../../../components/ui/stat-tile";
import {
  BEAUFORT_SCALE,
  type WindRoseMode,
} from "../../../constants/wind-rose";

type WindRoseBeaufortTableProps = {
  mode: WindRoseMode;
  activeNumber?: number | null;
};

function formatSpeedRange(entry: (typeof BEAUFORT_SCALE)[number]): string {
  return entry.maxSpeed === Number.POSITIVE_INFINITY
    ? `≥ ${entry.minSpeed}`
    : `${entry.minSpeed}–${entry.maxSpeed}`;
}

export default function WindRoseBeaufortTable({
  mode,
  activeNumber = null,
}: WindRoseBeaufortTableProps) {
  if (mode !== "wind") return null;

  return (
    <Card padded={false} className="col-span-12">
      <details className="group">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-6 py-4 [&::-webkit-details-marker]:hidden">
          <div>
            <h3 className="text-base font-semibold text-ink">
              Beaufort Scale reference
            </h3>
            <p className="text-xs text-slate-400">Mode: Wind · Unit: m/s</p>
          </div>
          <ChevronDown
            size={16}
            className="shrink-0 text-slate-400 transition-transform duration-200 group-open:rotate-180"
          />
        </summary>

        <div className="panel-scroll grid max-h-72 grid-cols-2 gap-2 overflow-y-auto border-t border-slate-100 p-6 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {BEAUFORT_SCALE.map((entry) => (
            <StatTile
              key={entry.number}
              label={`${entry.number} · ${entry.label}`}
              value={formatSpeedRange(entry)}
              active={entry.number === activeNumber}
            />
          ))}
        </div>
      </details>
    </Card>
  );
}
