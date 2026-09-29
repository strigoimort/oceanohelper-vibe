import L from "leaflet";

import { FILL_OPACITY_RATIO } from "../constants/drawing";

/** The same marker icon markup used by every point-style layer in the
 * Geospatial Workspace (single points, dataset imports, GeoJSON points). */
export function markerIconHtml(color: string): string {
  return `<span style="display:block;width:12px;height:12px;border-radius:9999px;background:${color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"></span>`;
}

function recolorMarker(marker: L.Marker, color: string) {
  marker.setIcon(
    L.divIcon({
      className: "",
      html: markerIconHtml(color),
      iconSize: [12, 12],
      iconAnchor: [6, 6],
    }),
  );
}

/**
 * Applies a color and opacity to any layer type the drawing tools create —
 * a single point marker, a path (polyline/polygon/rectangle/circle), or a
 * group of markers from an imported dataset.
 */
export function applyLayerAppearance(
  layer: L.Layer,
  color: string,
  opacity: number,
) {
  if (layer instanceof L.Marker) {
    recolorMarker(layer, color);
    layer.setOpacity(opacity);
    return;
  }

  if (layer instanceof L.Path) {
    layer.setStyle({
      color,
      opacity,
      fillOpacity: opacity * FILL_OPACITY_RATIO,
    });
    return;
  }

  if (layer instanceof L.LayerGroup) {
    layer.eachLayer((child) => applyLayerAppearance(child, color, opacity));
  }
}
