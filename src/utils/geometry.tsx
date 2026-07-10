import L from "leaflet";

const EARTH_RADIUS = 6378137; // meters

export function calculateLineLength(latlngs: L.LatLng[]): number {
  let total = 0;
  for (let i = 1; i < latlngs.length; i++) {
    total += latlngs[i - 1].distanceTo(latlngs[i]);
  }
  return total;
}

export function calculatePolygonArea(latlngs: L.LatLng[]): number {
  if (latlngs.length < 3) return 0;

  let area = 0;
  for (let i = 0; i < latlngs.length; i++) {
    const p1 = latlngs[i];
    const p2 = latlngs[(i + 1) % latlngs.length];
    area +=
      (((p2.lng - p1.lng) * Math.PI) / 180) *
      (2 +
        Math.sin((p1.lat * Math.PI) / 180) +
        Math.sin((p2.lat * Math.PI) / 180));
  }
  return Math.abs((area * EARTH_RADIUS * EARTH_RADIUS) / 2);
}

export function calculatePolygonPerimeter(latlngs: L.LatLng[]): number {
  if (latlngs.length < 2) return 0;
  return (
    calculateLineLength(latlngs) +
    latlngs[latlngs.length - 1].distanceTo(latlngs[0])
  );
}

export function circleArea(radiusMeters: number): number {
  return Math.PI * radiusMeters * radiusMeters;
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${meters.toFixed(1)} m`;
}

export function formatArea(squareMeters: number): string {
  if (squareMeters >= 1_000_000)
    return `${(squareMeters / 1_000_000).toFixed(2)} km²`;
  if (squareMeters >= 10_000) return `${(squareMeters / 10_000).toFixed(2)} ha`;
  return `${squareMeters.toFixed(1)} m²`;
}

export type LayerMeasurement = {
  distance?: number;
  perimeter?: number;
  area?: number;
  radius?: number;
  lat?: number;
  lng?: number;
};

/** Inspects a Leaflet layer instance and computes its geometry stats. */
export function measureLeafletLayer(layer: L.Layer): LayerMeasurement {
  if (layer instanceof L.Circle) {
    const radius = layer.getRadius();
    return { radius, area: circleArea(radius) };
  }

  if (layer instanceof L.Rectangle || layer instanceof L.Polygon) {
    const latlngs = (layer.getLatLngs()[0] as L.LatLng[]) ?? [];
    return {
      area: calculatePolygonArea(latlngs),
      perimeter: calculatePolygonPerimeter(latlngs),
    };
  }

  if (layer instanceof L.Polyline) {
    return { distance: calculateLineLength(layer.getLatLngs() as L.LatLng[]) };
  }

  if (layer instanceof L.Marker) {
    const { lat, lng } = layer.getLatLng();
    return { lat, lng };
  }

  return {};
}
