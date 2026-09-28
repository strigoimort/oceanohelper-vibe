import {
  BEAUFORT_SCALE,
  MAX_BREAKPOINTS,
  WIND_ROSE_COLOR_STOPS,
} from "../constants/wind-rose";
import type { WindRoseMode } from "../constants/wind-rose";
import { sampleColorScale } from "./color-scale";

const DAY_MS = 24 * 60 * 60 * 1000;

const COMPASS_POINTS = [
  "N",
  "NNE",
  "NE",
  "ENE",
  "E",
  "ESE",
  "SE",
  "SSE",
  "S",
  "SSW",
  "SW",
  "WSW",
  "W",
  "WNW",
  "NW",
  "NNW",
];

export type WindRoseRecord = {
  direction: number;
  magnitude: number;
  timestamp: string | null;
};

/** `null` means "unbounded". A direction range with From > To wraps through north. */
export type WindRoseFilters = {
  dateFrom: string | null;
  dateTo: string | null;
  magnitudeMin: number | null;
  magnitudeMax: number | null;
  directionFrom: number | null;
  directionTo: number | null;
};

export type WindRoseClassSummary = {
  index: number;
  label: string;
  count: number;
  percent: number;
};

export type WindRoseSectorSummary = {
  sectorIndex: number;
  label: string;
  center: number;
  count: number;
  percent: number;
  classes: WindRoseClassSummary[];
};

export type WindRoseAnalysis = {
  records: WindRoseRecord[];
  sectorCount: number;
  breakpoints: number[];
  classLabels: string[];
  sectors: WindRoseSectorSummary[];
  stats: {
    observationCount: number;
    dominantDirection: number | null;
    meanDirection: number;
    meanMagnitude: number;
    minMagnitude: number | null;
    maxMagnitude: number | null;
  };
  beaufortClass: {
    number: number;
    label: string;
    minSpeed: number;
    maxSpeed: number;
  } | null;
};

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

function toDegrees(radians: number): number {
  return (radians * 180) / Math.PI;
}

function clampDirection(value: number): number {
  const normalized = ((value % 360) + 360) % 360;
  return Number.isNaN(normalized) ? 0 : normalized;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "∞";
  return String(Number(value.toFixed(2)));
}

function createClassLabels(breakpoints: number[]): string[] {
  if (breakpoints.length === 0) {
    return ["0–∞"];
  }

  const labels = breakpoints.map((maximum, index) => {
    const minimum = index === 0 ? 0 : breakpoints[index - 1];
    return `${formatNumber(minimum)}–${formatNumber(maximum)}`;
  });

  labels.push(`>${formatNumber(breakpoints[breakpoints.length - 1])}`);
  return labels;
}

function getMagnitudeClassIndex(
  magnitude: number,
  breakpoints: number[],
): number {
  for (let index = 0; index < breakpoints.length; index += 1) {
    if (magnitude <= breakpoints[index]) {
      return index;
    }
  }
  return breakpoints.length;
}

function getSectorIndex(direction: number, sectorCount: number): number {
  if (sectorCount <= 0) return 0;
  const sectorSize = 360 / sectorCount;
  // Sectors are centered on compass points (N covers 348.75°–11.25° with
  // 16 sectors), so directions are shifted by half a sector before binning.
  const shifted = (clampDirection(direction) + sectorSize / 2) % 360;
  return Math.min(sectorCount - 1, Math.floor(shifted / sectorSize));
}

function matchesDateFilter(
  timestamp: string | null,
  dateFrom: string | null,
  dateTo: string | null,
): boolean {
  if (!timestamp) {
    return true;
  }

  const timestampValue = Date.parse(timestamp);
  if (Number.isNaN(timestampValue)) {
    return true;
  }

  if (dateFrom) {
    const fromValue = Date.parse(dateFrom);
    if (!Number.isNaN(fromValue) && timestampValue < fromValue) {
      return false;
    }
  }

  if (dateTo) {
    // "To" is inclusive of the whole selected day.
    const toValue = Date.parse(dateTo);
    if (!Number.isNaN(toValue) && timestampValue > toValue + DAY_MS - 1) {
      return false;
    }
  }

  return true;
}

function matchesMagnitudeFilter(
  magnitude: number,
  min: number | null,
  max: number | null,
): boolean {
  return (
    (min === null || magnitude >= min) && (max === null || magnitude <= max)
  );
}

function matchesDirectionFilter(
  direction: number,
  from: number | null,
  to: number | null,
): boolean {
  if (from === null && to === null) return true;

  const start = Math.min(360, Math.max(0, from ?? 0));
  const end = Math.min(360, Math.max(0, to ?? 360));
  const normalized = clampDirection(direction);

  return start <= end
    ? normalized >= start && normalized <= end
    : normalized >= start || normalized <= end;
}

export function hasActiveFilters(filters: WindRoseFilters): boolean {
  return Object.values(filters).some((value) => value !== null);
}

/** 16-point compass label (e.g. "NNE") for a direction in degrees. */
export function getCompassPoint(degrees: number): string {
  const index =
    Math.round(clampDirection(degrees) / 22.5) % COMPASS_POINTS.length;
  return COMPASS_POINTS[index];
}

export function getWindRoseClassColor(
  index: number,
  classCount: number,
): string {
  const position = classCount <= 1 ? 0 : index / (classCount - 1);
  return sampleColorScale(WIND_ROSE_COLOR_STOPS, position);
}

/** Parses "0.5, 1, 2" into sorted, unique, positive class upper bounds. */
export function parseBreakpoints(input: string): number[] {
  const values = input
    .split(/[\s,;]+/)
    .filter(Boolean)
    .map(Number)
    .filter((value) => Number.isFinite(value) && value > 0);

  return Array.from(new Set(values))
    .sort((left, right) => left - right)
    .slice(0, MAX_BREAKPOINTS);
}

export function classifyBeaufortSpeed(magnitude: number) {
  // Upper bounds are used so speeds between two published ranges still classify.
  return BEAUFORT_SCALE.find((entry) => magnitude <= entry.maxSpeed) ?? null;
}

export function buildWindRoseAnalysis(
  records: WindRoseRecord[],
  mode: WindRoseMode,
  sectorCount: number,
  breakpoints: number[],
  filters: WindRoseFilters,
): WindRoseAnalysis {
  const filteredRecords = records.filter(
    (record) =>
      matchesDateFilter(record.timestamp, filters.dateFrom, filters.dateTo) &&
      matchesMagnitudeFilter(
        record.magnitude,
        filters.magnitudeMin,
        filters.magnitudeMax,
      ) &&
      matchesDirectionFilter(
        record.direction,
        filters.directionFrom,
        filters.directionTo,
      ),
  );

  const classLabels = createClassLabels(breakpoints);
  const sectorSize = 360 / sectorCount;

  const sectorData = Array.from({ length: sectorCount }, (_, sectorIndex) => ({
    sectorIndex,
    label: `${Number((sectorIndex * sectorSize).toFixed(2))}°`,
    center: sectorIndex * sectorSize,
    count: 0,
    percent: 0,
    classes: classLabels.map((label, classIndex) => ({
      index: classIndex,
      label,
      count: 0,
      percent: 0,
    })),
  }));

  filteredRecords.forEach((record) => {
    const sectorIndex = getSectorIndex(record.direction, sectorCount);
    const classIndex = getMagnitudeClassIndex(record.magnitude, breakpoints);
    sectorData[sectorIndex].count += 1;
    sectorData[sectorIndex].classes[classIndex].count += 1;
  });

  const totalCount = filteredRecords.length;
  const sectors: WindRoseSectorSummary[] = sectorData.map((sector) => ({
    ...sector,
    percent: totalCount === 0 ? 0 : (sector.count / totalCount) * 100,
    classes: sector.classes.map((entry) => ({
      ...entry,
      percent: totalCount === 0 ? 0 : (entry.count / totalCount) * 100,
    })),
  }));

  const dominantSector = sectors.reduce<WindRoseSectorSummary | null>(
    (current, sector) =>
      !current || sector.count > current.count ? sector : current,
    null,
  );

  // Directions are circular, so the mean is taken from the vector sum.
  const sinSum = filteredRecords.reduce(
    (sum, record) => sum + Math.sin(toRadians(record.direction)),
    0,
  );
  const cosSum = filteredRecords.reduce(
    (sum, record) => sum + Math.cos(toRadians(record.direction)),
    0,
  );
  const meanDirection =
    totalCount === 0
      ? 0
      : clampDirection(toDegrees(Math.atan2(sinSum, cosSum)));

  const magnitudes = filteredRecords.map((record) => record.magnitude);
  const meanMagnitude =
    totalCount === 0
      ? 0
      : magnitudes.reduce((sum, value) => sum + value, 0) / totalCount;

  return {
    records: filteredRecords,
    sectorCount,
    breakpoints,
    classLabels,
    sectors,
    stats: {
      observationCount: totalCount,
      dominantDirection:
        dominantSector && dominantSector.count > 0
          ? dominantSector.center
          : null,
      meanDirection,
      meanMagnitude,
      minMagnitude: totalCount === 0 ? null : Math.min(...magnitudes),
      maxMagnitude: totalCount === 0 ? null : Math.max(...magnitudes),
    },
    beaufortClass:
      mode === "wind" && totalCount > 0
        ? classifyBeaufortSpeed(meanMagnitude)
        : null,
  };
}
