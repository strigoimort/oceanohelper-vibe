import type { WindRoseAnalysis } from "../../../utils/wind-rose";

type WindRoseChartProps = {
  analysis: WindRoseAnalysis;
  mode: "wind" | "wave";
};

const COLORS = ["#0f766e", "#0ea5e9", "#6366f1", "#f59e0b", "#ef4444"];

export default function WindRoseChart({ analysis, mode }: WindRoseChartProps) {
  const size = 360;
  const center = size / 2;
  const maxRadius = size * 0.36;

  const total = analysis.records.length || 1;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="text-base font-semibold text-slate-900">
            {mode === "wind" ? "Wind Rose" : "Wave Rose"}
          </h3>
          <p className="text-sm text-slate-500">
            {analysis.sectorCount} sectors • {analysis.breakpoints.length}{" "}
            magnitude classes
          </p>
        </div>
      </div>

      <svg
        viewBox={`0 0 ${size} ${size}`}
        className="w-full max-w-[640px] rounded-xl bg-slate-50 p-3"
      >
        <circle
          cx={center}
          cy={center}
          r={maxRadius}
          fill="none"
          stroke="#cbd5e1"
          strokeWidth="1"
        />
        {Array.from({ length: 4 }, (_, index) => {
          const radius = (maxRadius / 4) * (index + 1);
          return (
            <circle
              key={index}
              cx={center}
              cy={center}
              r={radius}
              fill="none"
              stroke="#e2e8f0"
              strokeWidth="1"
            />
          );
        })}

        {analysis.sectors.map((sector, index) => {
          const angle =
            (index / analysis.sectorCount) * Math.PI * 2 - Math.PI / 2;
          const x = center + Math.cos(angle) * maxRadius;
          const y = center + Math.sin(angle) * maxRadius;
          const radius = maxRadius * (sector.count / total);
          const points = [
            `${center},${center}`,
            `${center + Math.cos(angle) * radius},${center + Math.sin(angle) * radius}`,
            `${center + Math.cos(angle + (Math.PI * 2) / analysis.sectorCount) * radius},${center + Math.sin(angle + (Math.PI * 2) / analysis.sectorCount) * radius}`,
          ].join(" ");

          return (
            <g key={sector.sectorIndex}>
              <polygon
                points={points}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.35}
                stroke="#0f172a"
                strokeWidth="0.6"
              />
              <line
                x1={center}
                y1={center}
                x2={x}
                y2={y}
                stroke="#94a3b8"
                strokeWidth="1"
              />
              <text
                x={
                  center +
                  Math.cos(angle + (Math.PI * 2) / (analysis.sectorCount * 2)) *
                    (maxRadius + 18)
                }
                y={
                  center +
                  Math.sin(angle + (Math.PI * 2) / (analysis.sectorCount * 2)) *
                    (maxRadius + 18)
                }
                textAnchor="middle"
                fontSize="10"
                fill="#64748b"
              >
                {sector.count}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}
