import type { PathOptions } from "leaflet";

export const DRAWING_STYLES: Record<string, PathOptions> = {
  point: { color: "#0071e3" },
  polyline: { color: "#0071e3", weight: 3 },
  polygon: { color: "#0071e3", weight: 2, fillOpacity: 0.15 },
  rectangle: { color: "#0071e3", weight: 2, fillOpacity: 0.15 },
  circle: { color: "#0071e3", weight: 2, fillOpacity: 0.15 },
  measure: { color: "#f97316", weight: 3, dashArray: "6 4" },
  default: { color: "#0071e3" },
};
