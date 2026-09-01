import type { WindRoseAnalysis } from "../../../utils/wind-rose";

type WindRoseChartProps = { analysis: WindRoseAnalysis };

const COLORS = ["#38bdf8", "#0ea5e9", "#14b8a6", "#f59e0b", "#f97316", "#ef4444"];

function polarPoint(center: number, radius: number, angle: number) {
  const radians = ((angle - 90) * Math.PI) / 180;
  return { x: center + radius * Math.cos(radians), y: center + radius * Math.sin(radians) };
}

function annularSectorPath(center: number, innerRadius: number, outerRadius: number, startAngle: number, endAngle: number) {
  const startInner = polarPoint(center, innerRadius, startAngle);
  const startOuter = polarPoint(center, outerRadius, startAngle);
  const endOuter = polarPoint(center, outerRadius, endAngle);
  const endInner = polarPoint(center, innerRadius, endAngle);
  return [`M ${startInner.x} ${startInner.y}`, `L ${startOuter.x} ${startOuter.y}`, `A ${outerRadius} ${outerRadius} 0 0 1 ${endOuter.x} ${endOuter.y}`, `L ${endInner.x} ${endInner.y}`, `A ${innerRadius} ${innerRadius} 0 0 0 ${startInner.x} ${startInner.y}`, "Z"].join(" ");
}

export default function WindRoseChart({ analysis }: WindRoseChartProps) {
  const size = 400;
  const center = size / 2;
  const innerRadius = 20;
  const maxRadius = 165;
  const sectorAngle = 360 / analysis.sectorCount;
  const maxSectorCount = Math.max(...analysis.sectors.map((sector) => sector.count), 1);

  return (
    <div className="min-w-0 flex-1">
      <svg viewBox={`0 0 ${size} ${size}`} width="100%" height="100%" preserveAspectRatio="xMidYMid meet" className="mx-auto block h-auto w-full max-w-[420px]" aria-label="Wind rose chart" role="img">
        {[0.25, 0.5, 0.75, 1].map((fraction) => <circle key={fraction} cx={center} cy={center} r={innerRadius + fraction * (maxRadius - innerRadius)} fill="none" stroke="#e2e8f0" />)}
        {analysis.sectors.map((sector, index) => {
          const angle = index * sectorAngle;
          const spokeEnd = polarPoint(center, maxRadius, angle);
          const labelPoint = polarPoint(center, maxRadius + 15, angle);
          let radiusCursor = innerRadius;
          const startAngle = angle - sectorAngle / 2 + 1;
          const endAngle = angle + sectorAngle / 2 - 1;
          return <g key={sector.sectorIndex}>
            <line x1={center} y1={center} x2={spokeEnd.x} y2={spokeEnd.y} stroke="#e2e8f0" />
            {sector.classes.map((windClass, classIndex) => {
              const nextRadius = radiusCursor + (windClass.count / maxSectorCount) * (maxRadius - innerRadius);
              const path = annularSectorPath(center, radiusCursor, nextRadius, startAngle, endAngle);
              radiusCursor = nextRadius;
              return windClass.count > 0 ? <path key={classIndex} d={path} fill={COLORS[classIndex % COLORS.length]} /> : null;
            })}
            <text x={labelPoint.x} y={labelPoint.y} dominantBaseline="middle" fill="#94a3b8" fontSize="10" textAnchor="middle">{Math.round(angle)}°</text>
          </g>;
        })}
        <circle cx={center} cy={center} r={innerRadius} fill="#fff" />
      </svg>
    </div>
  );
}
