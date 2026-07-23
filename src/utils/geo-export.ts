import L from "leaflet";
import type { DrawnLayer } from "../features/geospatial-workspace/hooks/use-drawing-tools";
import type { ParticleDataset } from "../types/particle";

type ExportedFeature = {
  type: "Feature";
  geometry: Record<string, unknown>;
  properties: Record<string, unknown>;
};

type ExportedFeatureCollection = {
  type: "FeatureCollection";
  features: ExportedFeature[];
};

/** Converts drawn layers into a standard GeoJSON FeatureCollection. */
export function layersToGeoJson(
  layers: DrawnLayer[],
): ExportedFeatureCollection {
  const features: ExportedFeature[] = [];

  layers.forEach((layer) => {
    const leafletLayer = layer.leafletLayer as L.Layer & {
      toGeoJSON?: () => ExportedFeature;
    };

    if (typeof leafletLayer.toGeoJSON !== "function") return;

    const feature = leafletLayer.toGeoJSON();
    features.push({
      ...feature,
      properties: {
        ...feature.properties,
        name: layer.name,
        type: layer.type,
        color: layer.color,
      },
    });
  });

  return { type: "FeatureCollection", features };
}

/** Converts particle trajectories into a GeoJSON FeatureCollection of LineStrings. */
export function particleDatasetsToGeoJson(
  datasets: ParticleDataset[],
): ExportedFeatureCollection {
  const features: ExportedFeature[] = [];

  datasets
    .filter((dataset) => dataset.visible)
    .forEach((dataset) => {
      dataset.trajectories.forEach((trajectory) => {
        features.push({
          type: "Feature",
          geometry: {
            type: "LineString",
            coordinates: trajectory.points.map((p) => [p.lng, p.lat]),
          },
          properties: {
            particleId: trajectory.particleId,
            dataset: dataset.name,
            color: dataset.color,
            pointCount: trajectory.points.length,
          },
        });
      });
    });

  return { type: "FeatureCollection", features };
}
