import L from "leaflet";
import type { DrawnLayer } from "../features/geospatial-workspace/hooks/use-drawing-tools";

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
