import { useCallback, useState } from "react";
import type { Feature } from "geojson";

import {
  isTabularFile,
  parseShapefile,
  parseTabularFile,
} from "../../../services/file-service";
import {
  detectColumnMapping,
  type ColumnMapping,
} from "../../../utils/column-mapping";
import { parseNumericCell } from "../../../utils/numeric";

export type { ColumnMapping };
export type ImportKind = "csv" | "shapefile" | null;

export function useDatasetImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [kind, setKind] = useState<ImportKind>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    lat: null,
    lng: null,
    name: null,
  });

  const [shapefileFeatures, setShapefileFeatures] = useState<Feature[]>([]);

  const open = useCallback(() => setIsOpen(true), []);

  const reset = useCallback(() => {
    setIsOpen(false);
    setKind(null);
    setFileName(null);
    setError(null);
    setHeaders([]);
    setRows([]);
    setMapping({ lat: null, lng: null, name: null });
    setShapefileFeatures([]);
  }, []);

  const loadFile = useCallback(async (file: File) => {
    setError(null);

    if (isTabularFile(file)) {
      try {
        const { headers: parsedHeaders, rows: parsedRows } =
          await parseTabularFile(file);
        if (parsedRows.length === 0) {
          setError("The file doesn't contain any rows.");
          return;
        }
        setKind("csv");
        setFileName(file.name);
        setHeaders(parsedHeaders);
        setRows(parsedRows);
        setMapping(detectColumnMapping(parsedHeaders));
      } catch {
        setError("Failed to read the file. Please check the format.");
      }
      return;
    }

    if (file.name.toLowerCase().endsWith(".zip")) {
      try {
        const collections = await parseShapefile(file);
        const features = collections.flatMap(
          (collection) => collection.features,
        );

        if (features.length === 0) {
          setError("No features found in this shapefile.");
          return;
        }

        setKind("shapefile");
        setFileName(file.name);
        setShapefileFeatures(features);
      } catch {
        setError(
          "Failed to read the shapefile. Make sure the .zip contains .shp, .shx, and .dbf files.",
        );
      }
      return;
    }

    setError(
      "Unsupported file type. Use CSV, Excel (.xlsx), or a zipped Shapefile (.zip).",
    );
  }, []);

  const validRecords = rows
    .map((row) => {
      const lat = mapping.lat ? parseNumericCell(row[mapping.lat]) : NaN;
      const lng = mapping.lng ? parseNumericCell(row[mapping.lng]) : NaN;
      const name = mapping.name ? row[mapping.name] : undefined;

      if (Number.isNaN(lat) || Number.isNaN(lng)) return null;
      return { lat, lng, name };
    })
    .filter(
      (r): r is { lat: number; lng: number; name: string | undefined } =>
        r !== null,
    );

  return {
    isOpen,
    open,
    reset,
    kind,
    fileName,
    error,
    loadFile,
    headers,
    rows,
    mapping,
    setMapping,
    validRecords,
    shapefileFeatures,
  };
}
