export type WindRoseMode = "wind" | "wave";

export const DEFAULT_SECTOR_COUNT = 16;

export const SECTOR_OPTIONS = [8, 16, 32];

export const BEAUFORT_SCALE = [
  { number: 0, label: "Calm", minSpeed: 0, maxSpeed: 0.2 },
  { number: 1, label: "Light Air", minSpeed: 0.3, maxSpeed: 1.5 },
  { number: 2, label: "Light Breeze", minSpeed: 1.6, maxSpeed: 3.3 },
  { number: 3, label: "Gentle Breeze", minSpeed: 3.4, maxSpeed: 5.4 },
  { number: 4, label: "Moderate Breeze", minSpeed: 5.5, maxSpeed: 7.9 },
  { number: 5, label: "Fresh Breeze", minSpeed: 8.0, maxSpeed: 10.7 },
  { number: 6, label: "Strong Breeze", minSpeed: 10.8, maxSpeed: 13.8 },
  { number: 7, label: "Near Gale", minSpeed: 13.9, maxSpeed: 17.1 },
  { number: 8, label: "Gale", minSpeed: 17.2, maxSpeed: 20.7 },
  { number: 9, label: "Strong Gale", minSpeed: 20.8, maxSpeed: 24.4 },
  { number: 10, label: "Storm", minSpeed: 24.5, maxSpeed: 28.4 },
  { number: 11, label: "Violent Storm", minSpeed: 28.5, maxSpeed: 32.6 },
  {
    number: 12,
    label: "Hurricane",
    minSpeed: 32.7,
    maxSpeed: Number.POSITIVE_INFINITY,
  },
] as const;

export const DEFAULT_WAVE_HEIGHT_BREAKPOINTS = [
  0.5, 1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5,
];

export function getDefaultBreakpoints(mode: WindRoseMode): number[] {
  return mode === "wind"
    ? BEAUFORT_SCALE.filter((entry) => entry.number < 12).map(
        (entry) => entry.maxSpeed,
      )
    : DEFAULT_WAVE_HEIGHT_BREAKPOINTS;
}

export const MAX_BREAKPOINTS = 20;

/** Low → high intensity gradient used to color magnitude classes. */
export const WIND_ROSE_COLOR_STOPS = [
  "#bae6fd",
  "#38bdf8",
  "#0ea5e9",
  "#14b8a6",
  "#facc15",
  "#f97316",
  "#dc2626",
];
