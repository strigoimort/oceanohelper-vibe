import type { PathOptions } from "leaflet";

export const DRAWING_STYLES: Record<string, PathOptions> = {
  point: { color: "#0071e3" },
  dataset: { color: "#0071e3" },
  polyline: { color: "#0071e3", weight: 3 },
  polygon: { color: "#0071e3", weight: 2, fillOpacity: 0.15 },
  rectangle: { color: "#0071e3", weight: 2, fillOpacity: 0.15 },
  circle: { color: "#0071e3", weight: 2, fillOpacity: 0.15 },
  measure: { color: "#f97316", weight: 3, dashArray: "6 4" },
  default: { color: "#0071e3" },
};

/** Swatches offered in the layer style editor. */
export const LAYER_COLOR_PALETTE = [
  "#0071e3",
  "#f97316",
  "#10b981",
  "#ef4444",
  "#8b5cf6",
  "#eab308",
];

/** Fill opacity is derived from stroke opacity at this ratio, so a single
 * "Opacity" slider can drive both. */
export const FILL_OPACITY_RATIO = 0.2;
