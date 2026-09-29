import type { WindRoseMode } from "../../../constants/wind-rose";
import {
  getWindRoseClassColor,
  type WindRoseAnalysis,
} from "../../../utils/wind-rose";

type WindRoseLegendProps = {
  analysis: WindRoseAnalysis;
  mode: WindRoseMode;
};

export default function WindRoseLegend({
  analysis,
  mode,
}: WindRoseLegendProps) {
  const classCount = analysis.classLabels.length;

  return (
    <div className="w-full min-w-0 lg:w-52 lg:shrink-0">
      <h4 className="micro-label">
        {mode === "wind" ? "Speed class (m/s)" : "Height class (m)"}
      </h4>

      <ul className="mt-3 space-y-1.5">
        {analysis.classLabels.map((label, index) => {
          const share = analysis.sectors.reduce(
            (sum, sector) => sum + sector.classes[index].percent,
            0,
          );

          return (
            <li
              key={`${label}-${index}`}
              className="flex min-w-0 items-center gap-2 body-text"
            >
              <span
                className="size-2.5 shrink-0 rounded-full"
                style={{
                  backgroundColor: getWindRoseClassColor(index, classCount),
                }}
              />
              <span className="truncate">{label}</span>
              <span className="ml-auto shrink-0 text-xs tabular-nums text-slate-400">
                {share.toFixed(1)}%
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
