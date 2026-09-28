type Rgb = [number, number, number];

function hexToRgb(hex: string): Rgb {
  const value = hex.replace("#", "");
  return [
    parseInt(value.slice(0, 2), 16),
    parseInt(value.slice(2, 4), 16),
    parseInt(value.slice(4, 6), 16),
  ];
}

function toHex(channel: number): string {
  return Math.round(channel).toString(16).padStart(2, "0");
}

/** Returns the color at position t (0–1) along a multi-stop gradient. */
export function sampleColorScale(stops: string[], t: number): string {
  if (stops.length < 2) return stops[0] ?? "#000000";

  const scaled = Math.min(1, Math.max(0, t)) * (stops.length - 1);
  const lowerIndex = Math.min(Math.floor(scaled), stops.length - 2);
  const localT = scaled - lowerIndex;

  const from = hexToRgb(stops[lowerIndex]);
  const to = hexToRgb(stops[lowerIndex + 1]);

  return `#${from.map((channel, i) => toHex(channel + (to[i] - channel) * localT)).join("")}`;
}
