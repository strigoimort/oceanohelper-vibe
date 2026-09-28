import type { WindRoseMode } from "../../../constants/wind-rose";
import {
  getWindRoseClassColor,
  type WindRoseAnalysis,
} from "../../../utils/wind-rose";
import {
  CHART_CENTER,
  CHART_SIZE,
  COMPASS_LABELS,
  INNER_RADIUS,
  MAX_RADIUS,
  RING_FRACTIONS,
  annularSectorPath,
  describeSegment,
  formatRingPercent,
  getMaxSectorCount,
  getMaxSectorPercent,
  getRingRadius,
  getSectorAngles,
  getStackSegments,
  polarPoint,
} from "../../../utils/wind-rose-geometry";

type WindRoseChartProps = {
  analysis: WindRoseAnalysis;
  mode: WindRoseMode;
};

export default function WindRoseChart({ analysis, mode }: WindRoseChartProps) {
  const unit = mode === "wind" ? "m/s" : "m";
  const classCount = analysis.classLabels.length;
  const maxSectorCount = getMaxSectorCount(analysis);
  const maxPercent = getMaxSectorPercent(analysis);
  const ringLabelAngle = 180 / analysis.sectorCount;

  return (
    <div className="min-w-0 flex-1">
      <svg
        viewBox={`0 0 ${CHART_SIZE} ${CHART_SIZE}`}
        width="100%"
        height="100%"
        preserveAspectRatio="xMidYMid meet"
        className="mx-auto block h-auto w-full max-w-[420px]"
        aria-label={`${mode === "wind" ? "Wind" : "Wave"} rose chart`}
        role="img"
      >
        {RING_FRACTIONS.map((fraction) => (
          <circle
            key={fraction}
            cx={CHART_CENTER}
            cy={CHART_CENTER}
            r={getRingRadius(fraction)}
            fill="none"
            stroke="#e2e8f0"
          />
        ))}

        {analysis.sectors.map((sector) => {
          const { start, end } = getSectorAngles(
            sector.sectorIndex,
            analysis.sectorCount,
          );
          const spokeEnd = polarPoint(MAX_RADIUS, sector.center);

          return (
            <g key={sector.sectorIndex}>
              <line
                x1={CHART_CENTER}
                y1={CHART_CENTER}
                x2={spokeEnd.x}
                y2={spokeEnd.y}
                stroke="#e2e8f0"
              />

              {getStackSegments(sector, maxSectorCount).map((segment) => (
                <path
                  key={segment.classIndex}
                  d={annularSectorPath(
                    segment.innerRadius,
                    segment.outerRadius,
                    start,
                    end,
                  )}
                  fill={getWindRoseClassColor(segment.classIndex, classCount)}
                  className="transition-opacity hover:opacity-80"
                >
                  <title>{describeSegment(sector, segment, unit)}</title>
                </path>
              ))}
            </g>
          );
        })}

        {RING_FRACTIONS.map((fraction) => {
          const point = polarPoint(getRingRadius(fraction), ringLabelAngle);

          return (
            <text
              key={fraction}
              x={point.x}
              y={point.y}
              fontSize="9"
              fill="#94a3b8"
              textAnchor="middle"
              dominantBaseline="middle"
              paintOrder="stroke"
              stroke="#ffffff"
              strokeWidth="3"
              strokeLinejoin="round"
            >
              {formatRingPercent(fraction * maxPercent)}
            </text>
          );
        })}

        <circle
          cx={CHART_CENTER}
          cy={CHART_CENTER}
          r={INNER_RADIUS}
          fill="#ffffff"
        />

        {COMPASS_LABELS.map(({ label, angle, isCardinal }) => {
          const point = polarPoint(MAX_RADIUS + 16, angle);

          return (
            <text
              key={label}
              x={point.x}
              y={point.y}
              fontSize={isCardinal ? 12 : 10}
              fontWeight={isCardinal ? 600 : 400}
              fill={isCardinal ? "#334155" : "#94a3b8"}
              textAnchor="middle"
              dominantBaseline="middle"
            >
              {label}
            </text>
          );
        })}
      </svg>
    </div>
  );
}
