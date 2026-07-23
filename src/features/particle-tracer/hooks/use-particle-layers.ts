import { useEffect, useRef } from "react";
import L from "leaflet";

import type { ParticleDataset } from "../../../types/particle";
import {
  computeForecastPoints,
  getCurrentPoint,
  getPointsUpTo,
} from "../../../utils/particle-tracer";
import type { ForecastSettings } from "../components/particle-forecast-panel";
import type { ParticleSelection } from "./use-particle-datasets";

type UseParticleLayersOptions = {
  map: L.Map | null;
  datasets: ParticleDataset[];
  currentTime: number;
  onSelectParticle: (selection: ParticleSelection) => void;
  selectedParticle: ParticleSelection | null;
  forecast: ForecastSettings;
};

const MARKER_RADIUS = 5;
const SELECTED_MARKER_RADIUS = 7;
const FORECAST_MARKER_RADIUS = 4;

/**
 * Renders each dataset's trajectories as growing polylines with a marker at
 * the particle's current position, plus an optional dashed forecast segment
 * projected from the particle's last known observation. Owns all Leaflet
 * drawing so the page component stays presentational.
 */
export function useParticleLayers({
  map,
  datasets,
  currentTime,
  onSelectParticle,
  selectedParticle,
  forecast,
}: UseParticleLayersOptions) {
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  useEffect(() => {
    if (!map) return undefined;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      layerGroupRef.current?.remove();
      layerGroupRef.current = null;
    };
  }, [map]);

  useEffect(() => {
    const layerGroup = layerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    datasets
      .filter((dataset) => dataset.visible)
      .forEach((dataset) => {
        dataset.trajectories.forEach((trajectory) => {
          const trailPoints = getPointsUpTo(trajectory, currentTime);
          if (trailPoints.length === 0) return;

          const isSelected =
            selectedParticle?.datasetId === dataset.id &&
            selectedParticle?.particleId === trajectory.particleId;

          if (trailPoints.length > 1) {
            const line = L.polyline(
              trailPoints.map((p) => [p.lat, p.lng]),
              {
                color: dataset.color,
                weight: isSelected ? 4 : 2,
                opacity: isSelected ? 1 : 0.7,
              },
            );
            layerGroup.addLayer(line);
          }

          const current = getCurrentPoint(trajectory, currentTime);
          if (!current) return;

          const marker = L.circleMarker([current.lat, current.lng], {
            radius: isSelected ? SELECTED_MARKER_RADIUS : MARKER_RADIUS,
            color: "#ffffff",
            weight: 2,
            fillColor: dataset.color,
            fillOpacity: 1,
          });

          marker.on("click", () =>
            onSelectParticle({
              datasetId: dataset.id,
              particleId: trajectory.particleId,
            }),
          );
          marker.bindTooltip(trajectory.particleId, {
            direction: "top",
            offset: [0, -6],
          });

          layerGroup.addLayer(marker);

          if (!forecast.enabled) return;

          // Forecast always projects from the dataset's actual last
          // observation, independent of the historical playback position.
          const lastKnown = trajectory.points[trajectory.points.length - 1];
          const forecastPoints = computeForecastPoints(trajectory, {
            durationHours: forecast.durationHours,
            intervalHours: forecast.intervalHours,
          });
          if (forecastPoints.length === 0) return;

          const forecastLine = L.polyline(
            [lastKnown, ...forecastPoints].map((p) => [p.lat, p.lng]),
            {
              color: dataset.color,
              weight: isSelected ? 3 : 2,
              opacity: 0.5,
              dashArray: "6 5",
            },
          );
          layerGroup.addLayer(forecastLine);

          const forecastEnd = forecastPoints[forecastPoints.length - 1];
          const forecastMarker = L.circleMarker(
            [forecastEnd.lat, forecastEnd.lng],
            {
              radius: FORECAST_MARKER_RADIUS,
              color: dataset.color,
              weight: 2,
              fillColor: "#ffffff",
              fillOpacity: 1,
            },
          );
          forecastMarker.bindTooltip(
            `${trajectory.particleId} (forecast +${forecast.durationHours}h)`,
            { direction: "top", offset: [0, -6] },
          );
          layerGroup.addLayer(forecastMarker);
        });
      });
  }, [datasets, currentTime, selectedParticle, onSelectParticle, forecast]);
}
