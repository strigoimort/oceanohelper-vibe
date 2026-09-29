import type { ParticleDataset } from "../../../types/particle";
import type { ParticleSelection } from "../hooks/use-particle-datasets";
import {
  computeStatistics,
  formatDirection,
  formatDistance,
  formatElapsed,
  formatSpeed,
  getCurrentPoint,
  getDistanceTraveled,
} from "../../../utils/particle-tracer";

type ParticleInfoPanelProps = {
  datasets: ParticleDataset[];
  currentTime: number;
  selectedParticle: ParticleSelection | null;
};

export default function ParticleInfoPanel({
  datasets,
  currentTime,
  selectedParticle,
}: ParticleInfoPanelProps) {
  const stats = computeStatistics(datasets, currentTime);

  const selectedDataset = datasets.find(
    (d) => d.id === selectedParticle?.datasetId,
  );
  const selectedTrajectory = selectedDataset?.trajectories.find(
    (t) => t.particleId === selectedParticle?.particleId,
  );
  const currentPoint = selectedTrajectory
    ? getCurrentPoint(selectedTrajectory, currentTime)
    : null;
  const firstPoint = selectedTrajectory?.points[0];
  const elapsedSeconds =
    currentPoint && firstPoint
      ? (currentPoint.time - firstPoint.time) / 1000
      : 0;
  const distanceTraveled = selectedTrajectory
    ? getDistanceTraveled(selectedTrajectory, currentTime)
    : 0;

  return (
    <div className="space-y-4">
      <section>
        <h2 className="micro-label">Statistics</h2>
        <dl className="mt-1 space-y-1 text-sm">
          <Row label="Total particles" value={stats.totalParticles} />
          <Row label="Active particles" value={stats.activeParticles} />
          <Row
            label="Total distance"
            value={formatDistance(stats.totalDistance)}
          />
          <Row label="Average speed" value={formatSpeed(stats.averageSpeed)} />
          <Row label="Max speed" value={formatSpeed(stats.maxSpeed)} />
        </dl>
      </section>

      <section className="border-t border-slate-100 pt-3">
        <h2 className="micro-label">Selected particle</h2>

        {!selectedTrajectory || !currentPoint ? (
          <p className="mt-1 body-text">
            Click a particle marker on the map to inspect it.
          </p>
        ) : (
          <dl className="mt-2 space-y-1 text-sm">
            <Row label="Particle ID" value={selectedTrajectory.particleId} />
            <Row label="Latitude" value={currentPoint.lat.toFixed(4)} />
            <Row label="Longitude" value={currentPoint.lng.toFixed(4)} />
            <Row
              label="Speed"
              value={
                currentPoint.speed !== undefined
                  ? formatSpeed(currentPoint.speed)
                  : "—"
              }
            />
            <Row
              label="Direction"
              value={
                currentPoint.direction !== undefined
                  ? formatDirection(currentPoint.direction)
                  : "—"
              }
            />
            <Row
              label="Distance traveled"
              value={formatDistance(distanceTraveled)}
            />
            <Row label="Elapsed time" value={formatElapsed(elapsedSeconds)} />
          </dl>
        )}
      </section>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex items-center justify-between">
      <dt className="text-slate-600 ">{label}</dt>
      <dd className="font-medium text-slate-900">{value}</dd>
    </div>
  );
}
