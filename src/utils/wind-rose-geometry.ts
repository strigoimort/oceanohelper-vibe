import type { WindRoseMode } from "../constants/wind-rose";
import {
  getCompassPoint,
  getWindRoseClassColor,
  type WindRoseAnalysis,
  type WindRoseSectorSummary,
} from "./wind-rose";

export const CHART_SIZE = 400;
export const CHART_CENTER = CHART_SIZE / 2;
export const INNER_RADIUS = 20;
export const MAX_RADIUS = 160;
export const RING_FRACTIONS = [0.25, 0.5, 0.75, 1];

const SECTOR_GAP_DEGREES = 1;
const LEGEND_X = 450;
const LEGEND_TOP = 84;
const LEGEND_ROW_HEIGHT = 22;
const EXPORT_WIDTH = 680;
const EXPORT_MIN_HEIGHT = 460;

export const COMPASS_LABELS = [
  { label: "N", angle: 0, isCardinal: true },
  { label: "NE", angle: 45, isCardinal: false },
  { label: "E", angle: 90, isCardinal: true },
  { label: "SE", angle: 135, isCardinal: false },
  { label: "S", angle: 180, isCardinal: true },
  { label: "SW", angle: 225, isCardinal: false },
  { label: "W", angle: 270, isCardinal: true },
  { label: "NW", angle: 315, isCardinal: false },
];

export type StackSegment = {
  classIndex: number;
  label: string;
  count: number;
  percent: number;
  innerRadius: number;
  outerRadius: number;
};

export function polarPoint(radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return {
    x: CHART_CENTER + radius * Math.cos(radians),
    y: CHART_CENTER + radius * Math.sin(radians),
  };
}

function formatPoint(point: { x: number; y: number }): string {
  return `${point.x.toFixed(2)} ${point.y.toFixed(2)}`;
}

export function annularSectorPath(
  innerRadius: number,
  outerRadius: number,
  startAngle: number,
  endAngle: number,
): string {
  const startInner = polarPoint(innerRadius, startAngle);
  const startOuter = polarPoint(outerRadius, startAngle);
  const endOuter = polarPoint(outerRadius, endAngle);
  const endInner = polarPoint(innerRadius, endAngle);
  const outer = outerRadius.toFixed(2);
  const inner = innerRadius.toFixed(2);

  return [
    `M ${formatPoint(startInner)}`,
    `L ${formatPoint(startOuter)}`,
    `A ${outer} ${outer} 0 0 1 ${formatPoint(endOuter)}`,
    `L ${formatPoint(endInner)}`,
    `A ${inner} ${inner} 0 0 0 ${formatPoint(startInner)}`,
    "Z",
  ].join(" ");
}

export function getRingRadius(fraction: number): number {
  return INNER_RADIUS + fraction * (MAX_RADIUS - INNER_RADIUS);
}

/** Sectors are centered on their compass direction, with a small visual gap. */
export function getSectorAngles(sectorIndex: number, sectorCount: number) {
  const sectorSize = 360 / sectorCount;
  const center = sectorIndex * sectorSize;

  return {
    center,
    start: center - sectorSize / 2 + SECTOR_GAP_DEGREES,
    end: center + sectorSize / 2 - SECTOR_GAP_DEGREES,
  };
}

export function getMaxSectorCount(analysis: WindRoseAnalysis): number {
  return Math.max(...analysis.sectors.map((sector) => sector.count), 1);
}

export function getMaxSectorPercent(analysis: WindRoseAnalysis): number {
  return Math.max(...analysis.sectors.map((sector) => sector.percent), 0);
}

/** Stacks a sector's magnitude classes outward from the center. */
export function getStackSegments(
  sector: WindRoseSectorSummary,
  maxSectorCount: number,
): StackSegment[] {
  const span = MAX_RADIUS - INNER_RADIUS;
  const segments: StackSegment[] = [];
  let cursor = INNER_RADIUS;

  sector.classes.forEach((windClass) => {
    if (windClass.count === 0) return;

    const outerRadius = cursor + (windClass.count / maxSectorCount) * span;
    segments.push({
      classIndex: windClass.index,
      label: windClass.label,
      count: windClass.count,
      percent: windClass.percent,
      innerRadius: cursor,
      outerRadius,
    });
    cursor = outerRadius;
  });

  return segments;
}

export function formatRingPercent(value: number): string {
  return `${value.toFixed(value >= 10 ? 0 : 1)}%`;
}

export function describeSegment(
  sector: WindRoseSectorSummary,
  segment: StackSegment,
  unit: string,
): string {
  const angle = Number(sector.center.toFixed(1));
  return `${getCompassPoint(sector.center)} (${angle}°) · ${segment.label} ${unit}: ${segment.count} obs (${segment.percent.toFixed(1)}%)`;
}

function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

/** Builds a standalone SVG that matches the on-screen chart, including a legend. */
export function buildWindRoseSvgMarkup(
  analysis: WindRoseAnalysis,
  mode: WindRoseMode,
): string {
  const unit = mode === "wind" ? "m/s" : "m";
  const title = mode === "wind" ? "Wind Rose" : "Wave Rose";
  const classCount = analysis.classLabels.length;
  const maxSectorCount = getMaxSectorCount(analysis);
  const maxPercent = getMaxSectorPercent(analysis);
  const ringLabelAngle = 180 / analysis.sectorCount;
  const height = Math.max(
    EXPORT_MIN_HEIGHT,
    LEGEND_TOP + classCount * LEGEND_ROW_HEIGHT + 20,
  );

  const rings = RING_FRACTIONS.map(
    (fraction) =>
      `<circle cx="${CHART_CENTER}" cy="${CHART_CENTER}" r="${getRingRadius(fraction)}" fill="none" stroke="#e2e8f0" />`,
  ).join("");

  const spokes = analysis.sectors
    .map((sector) => {
      const end = polarPoint(MAX_RADIUS, sector.center);
      return `<line x1="${CHART_CENTER}" y1="${CHART_CENTER}" x2="${end.x.toFixed(2)}" y2="${end.y.toFixed(2)}" stroke="#e2e8f0" />`;
    })
    .join("");

  const petals = analysis.sectors
    .flatMap((sector) => {
      const { start, end } = getSectorAngles(
        sector.sectorIndex,
        analysis.sectorCount,
      );

      return getStackSegments(sector, maxSectorCount).map(
        (segment) =>
          `<path d="${annularSectorPath(segment.innerRadius, segment.outerRadius, start, end)}" fill="${getWindRoseClassColor(segment.classIndex, classCount)}"><title>${escapeXml(describeSegment(sector, segment, unit))}</title></path>`,
      );
    })
    .join("");

  const ringLabels = RING_FRACTIONS.map((fraction) => {
    const point = polarPoint(getRingRadius(fraction), ringLabelAngle);
    return `<text x="${point.x.toFixed(1)}" y="${point.y.toFixed(1)}" font-size="9" fill="#94a3b8" text-anchor="middle" dominant-baseline="middle" paint-order="stroke" stroke="#ffffff" stroke-width="3" stroke-linejoin="round">${formatRingPercent(fraction * maxPercent)}</text>`;
  }).join("");

  const compass = COMPASS_LABELS.map(({ label, angle, isCardinal }) => {
    const point = polarPoint(MAX_RADIUS + 16, angle);
    return `<text x="${point.x.toFixed(1)}" y="${point.y.toFixed(1)}" font-size="${isCardinal ? 12 : 10}" font-weight="${isCardinal ? 600 : 400}" fill="${isCardinal ? "#334155" : "#94a3b8"}" text-anchor="middle" dominant-baseline="middle">${label}</text>`;
  }).join("");

  const legend = analysis.classLabels
    .map((label, index) => {
      const y = LEGEND_TOP + index * LEGEND_ROW_HEIGHT;
      return `<rect x="${LEGEND_X}" y="${y - 6}" width="12" height="12" rx="3" fill="${getWindRoseClassColor(index, classCount)}" /><text x="${LEGEND_X + 20}" y="${y}" font-size="12" fill="#475569" dominant-baseline="middle">${escapeXml(label)}</text>`;
    })
    .join("");

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${EXPORT_WIDTH} ${height}" width="${EXPORT_WIDTH * 2}" height="${height * 2}" font-family="system-ui, sans-serif"><rect width="100%" height="100%" fill="#ffffff" /><text x="20" y="28" font-size="18" font-weight="600" fill="#0f172a">${title}</text><g transform="translate(20 40)">${rings}${spokes}${petals}${ringLabels}<circle cx="${CHART_CENTER}" cy="${CHART_CENTER}" r="${INNER_RADIUS}" fill="#ffffff" />${compass}</g><text x="${LEGEND_X}" y="56" font-size="11" font-weight="600" fill="#94a3b8">${mode === "wind" ? "Speed class" : "Height class"} (${unit})</text>${legend}</svg>`;
}
