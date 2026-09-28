import Card from "../../../components/ui/card";
import StatTile from "../../../components/ui/stat-tile";
import type { WindRoseMode } from "../../../constants/wind-rose";
import {
  getCompassPoint,
  type WindRoseAnalysis,
} from "../../../utils/wind-rose";

type WindRoseStatisticsPanelProps = {
  analysis: WindRoseAnalysis;
  mode: WindRoseMode;
};

function formatDegrees(value: number | null): string {
  return value === null ? "—" : `${value.toFixed(1)}°`;
}

export default function WindRoseStatisticsPanel({
  analysis,
  mode,
}: WindRoseStatisticsPanelProps) {
  const { stats, beaufortClass } = analysis;
  const hasObservations = stats.observationCount > 0;
  const unit = mode === "wind" ? "m/s" : "m";
  const magnitudeName = mode === "wind" ? "speed" : "height";

  return (
    <Card>
      <h3 className="text-base font-semibold text-ink">Summary statistics</h3>

      <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatTile label="Observations" value={stats.observationCount} />
        <StatTile
          label="Dominant direction"
          value={formatDegrees(stats.dominantDirection)}
          hint={
            stats.dominantDirection === null
              ? undefined
              : getCompassPoint(stats.dominantDirection)
          }
        />
        <StatTile
          label="Mean direction"
          value={hasObservations ? formatDegrees(stats.meanDirection) : "—"}
          hint={
            hasObservations ? getCompassPoint(stats.meanDirection) : undefined
          }
        />
        <StatTile
          label={`Mean ${magnitudeName} (${unit})`}
          value={hasObservations ? stats.meanMagnitude.toFixed(2) : "—"}
        />
        <StatTile
          label={`Min (${unit})`}
          value={stats.minMagnitude?.toFixed(2) ?? "—"}
        />
        <StatTile
          label={`Max (${unit})`}
          value={stats.maxMagnitude?.toFixed(2) ?? "—"}
        />
      </div>

      {mode === "wind" && (
        <div className="mt-3 flex items-center justify-between gap-3 rounded-xl bg-accent-soft px-3 py-2.5">
          <p className="text-xs text-slate-600">Beaufort class (mean speed)</p>
          <p className="truncate text-sm font-semibold text-accent">
            {beaufortClass
              ? `Bft ${beaufortClass.number} · ${beaufortClass.label}`
              : "—"}
          </p>
        </div>
      )}
    </Card>
  );
}
