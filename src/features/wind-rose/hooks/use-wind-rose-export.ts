import { useCallback, useState } from "react";

import type { WindRoseMode } from "../../../constants/wind-rose";
import {
  downloadBlobFile,
  downloadTextFile,
} from "../../../services/file-service";
import {
  svgToPdfBlob,
  svgToPngBlob,
} from "../../../services/image-export-service";
import type { WindRoseAnalysis } from "../../../utils/wind-rose";
import { buildWindRoseSvgMarkup } from "../../../utils/wind-rose-geometry";

export type WindRoseExportFormat = "png" | "pdf" | "svg" | "csv";

function buildSummaryCsv(analysis: WindRoseAnalysis): string {
  const { stats } = analysis;
  const rows: (string | number)[][] = [
    ["metric", "value"],
    ["observations", stats.observationCount],
    ["dominant_direction", stats.dominantDirection ?? ""],
    ["mean_direction", stats.meanDirection],
    ["mean_magnitude", stats.meanMagnitude],
    ["min_magnitude", stats.minMagnitude ?? ""],
    ["max_magnitude", stats.maxMagnitude ?? ""],
  ];

  return rows.map((row) => row.join(",")).join("\n");
}

export function useWindRoseExport(
  analysis: WindRoseAnalysis,
  mode: WindRoseMode,
) {
  const [error, setError] = useState<string | null>(null);

  const exportAs = useCallback(
    async (format: WindRoseExportFormat) => {
      setError(null);
      const baseName = `wind-rose-${mode}-${Date.now()}`;

      try {
        if (format === "csv") {
          downloadTextFile(
            `${baseName}-summary.csv`,
            buildSummaryCsv(analysis),
            "text/csv",
          );
          return;
        }

        const svgMarkup = buildWindRoseSvgMarkup(analysis, mode);

        if (format === "svg") {
          downloadTextFile(`${baseName}.svg`, svgMarkup, "image/svg+xml");
          return;
        }

        if (format === "png") {
          downloadBlobFile(`${baseName}.png`, await svgToPngBlob(svgMarkup));
          return;
        }

        downloadBlobFile(`${baseName}.pdf`, await svgToPdfBlob(svgMarkup));
      } catch (exportError) {
        setError(
          exportError instanceof Error
            ? exportError.message
            : `Failed to export ${format.toUpperCase()}.`,
        );
      }
    },
    [analysis, mode],
  );

  return { exportAs, error };
}
