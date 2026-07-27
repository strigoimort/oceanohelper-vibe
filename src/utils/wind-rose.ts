import { BEAUFORT_SCALE } from "../constants/wind-rose";
import type { WindRoseMode } from "../constants/wind-rose";

export type WindRoseRecord = {
  direction: number;
  magnitude: number;
  timestamp: string | null;
};

export type WindRoseFilters = {
  dateFrom: string | null;
  dateTo: string | null;
  magnitudeRange: [number, number];
  directionRange: [number, number];
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

function clampDirection(value: number): number {
  const normalized = ((value % 360) + 360) % 360;
  return Number.isNaN(normalized) ? 0 : normalized;
}

function formatNumber(value: number): string {
  if (!Number.isFinite(value)) return "∞";
  return value.toFixed(1);
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
  const normalized = clampDirection(direction);
  const sectorIndex = Math.floor(normalized / sectorSize);
  return Math.min(sectorCount - 1, sectorIndex);
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
    const toValue = Date.parse(dateTo);
    if (!Number.isNaN(toValue) && timestampValue > toValue) {
      return false;
    }
  }

  return true;
}

export function classifyBeaufortSpeed(magnitude: number) {
  return (
    BEAUFORT_SCALE.find(
      (entry) => magnitude >= entry.minSpeed && magnitude <= entry.maxSpeed,
    ) ?? null
  );
}

export function buildWindRoseSvgMarkup(
  analysis: WindRoseAnalysis,
  mode: WindRoseMode,
): string {
  const size = 360;
  const center = size / 2;
  const maxRadius = size * 0.36;
  const total = analysis.records.length || 1;

  const sectors = analysis.sectors
    .map((sector) => {
      const angle =
        (sector.sectorIndex / analysis.sectorCount) * Math.PI * 2 - Math.PI / 2;
      const radius = maxRadius * (sector.count / total);
      const x1 = center + Math.cos(angle) * radius;
      const y1 = center + Math.sin(angle) * radius;
      const x2 =
        center +
        Math.cos(angle + (Math.PI * 2) / analysis.sectorCount) * radius;
      const y2 =
        center +
        Math.sin(angle + (Math.PI * 2) / analysis.sectorCount) * radius;

      return `<polygon points="${center},${center} ${x1},${y1} ${x2},${y2}" fill="#0ea5e9" fill-opacity="0.35" stroke="#0f172a" stroke-width="0.6" />`;
    })
    .join("\n");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="1200" height="1200"><rect width="100%" height="100%" fill="#f8fafc" /><circle cx="${center}" cy="${center}" r="${maxRadius}" fill="none" stroke="#cbd5e1" stroke-width="1" />${Array.from(
    { length: 4 },
    (_, index) => {
      const radius = (maxRadius / 4) * (index + 1);
      return `<circle cx="${center}" cy="${center}" r="${radius}" fill="none" stroke="#e2e8f0" stroke-width="1" />`;
    },
  ).join(
    "",
  )}${sectors}<text x="${center}" y="30" text-anchor="middle" font-size="20" fill="#0f172a">${mode === "wind" ? "Wind Rose" : "Wave Rose"}</text></svg>`;
}

export function buildWindRoseAnalysis(
  records: WindRoseRecord[],
  mode: WindRoseMode,
  sectorCount: number,
  breakpoints: number[],
  filters: WindRoseFilters,
): WindRoseAnalysis {
  const filteredRecords = records.filter((record) => {
    if (
      !matchesDateFilter(record.timestamp, filters.dateFrom, filters.dateTo)
    ) {
      return false;
    }

    if (
      record.magnitude < filters.magnitudeRange[0] ||
      record.magnitude > filters.magnitudeRange[1]
    ) {
      return false;
    }

    const direction = clampDirection(record.direction);
    return (
      direction >= filters.directionRange[0] &&
      direction <= filters.directionRange[1]
    );
  });

  const classLabels = createClassLabels(breakpoints);
  const classCount = classLabels.length;
  const sectorData = Array.from({ length: sectorCount }, (_, sectorIndex) => ({
    sectorIndex,
    label: `${Math.round((sectorIndex / sectorCount) * 360)}°`,
    center: (sectorIndex + 0.5) * (360 / sectorCount),
    count: 0,
    percent: 0,
    classes: Array.from({ length: classCount }, (_, classIndex) => ({
      index: classIndex,
      label: classLabels[classIndex],
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
  const sectors = sectorData.map((sector) => ({
    ...sector,
    percent: totalCount === 0 ? 0 : (sector.count / totalCount) * 100,
    classes: sector.classes.map((entry) => ({
      ...entry,
      percent: totalCount === 0 ? 0 : (entry.count / totalCount) * 100,
    })),
  }));

  const dominantSector = sectors.reduce<WindRoseSectorSummary | null>(
    (current, sector) => {
      if (!current || sector.count > current.count) {
        return sector;
      }
      return current;
    },
    null,
  );

  const meanDirection =
    filteredRecords.length === 0
      ? 0
      : clampDirection(
          (Math.atan2(
            filteredRecords.reduce(
              (sum, record) =>
                sum + Math.sin((record.direction * Math.PI) / 180),
              0,
            ),
            filteredRecords.reduce(
              (sum, record) =>
                sum + Math.cos((record.direction * Math.PI) / 180),
              0,
            ),
          ) *
            180) /
            Math.PI,
        );

  const meanMagnitude =
    filteredRecords.length === 0
      ? 0
      : filteredRecords.reduce((sum, record) => sum + record.magnitude, 0) /
        filteredRecords.length;

  const magnitudes = filteredRecords.map((record) => record.magnitude);

  return {
    records: filteredRecords,
    sectorCount,
    breakpoints,
    classLabels,
    sectors,
    stats: {
      observationCount: filteredRecords.length,
      dominantDirection: dominantSector?.center ?? null,
      meanDirection,
      meanMagnitude,
      minMagnitude: magnitudes.length === 0 ? null : Math.min(...magnitudes),
      maxMagnitude: magnitudes.length === 0 ? null : Math.max(...magnitudes),
    },
    beaufortClass:
      mode === "wind" && filteredRecords.length > 0
        ? classifyBeaufortSpeed(meanMagnitude)
        : null,
  };
}
