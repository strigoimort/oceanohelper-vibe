import { useCallback, useState } from "react";

import { parseCsvFile } from "../../../services/file-service";
import {
  detectColumnMapping,
  type ColumnMapping,
} from "../../../utils/column-mapping";

export type { ColumnMapping };

export function useDatasetImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ColumnMapping>({
    lat: null,
    lng: null,
    name: null,
  });
  const [error, setError] = useState<string | null>(null);

  const open = useCallback(() => setIsOpen(true), []);

  const reset = useCallback(() => {
    setIsOpen(false);
    setFileName(null);
    setHeaders([]);
    setRows([]);
    setMapping({ lat: null, lng: null, name: null });
    setError(null);
  }, []);

  const loadFile = useCallback(async (file: File) => {
    setError(null);

    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Only CSV files are supported at the moment.");
      return;
    }

    try {
      const { headers: parsedHeaders, rows: parsedRows } =
        await parseCsvFile(file);

      if (parsedRows.length === 0) {
        setError("The file doesn't contain any rows.");
        return;
      }

      setFileName(file.name);
      setHeaders(parsedHeaders);
      setRows(parsedRows);
      setMapping(detectColumnMapping(parsedHeaders));
    } catch {
      setError("Failed to read the file. Please check the format.");
    }
  }, []);

  const validRecords = rows
    .map((row) => {
      const lat = mapping.lat ? Number(row[mapping.lat]) : NaN;
      const lng = mapping.lng ? Number(row[mapping.lng]) : NaN;
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
    fileName,
    headers,
    rows,
    mapping,
    setMapping,
    error,
    loadFile,
    validRecords,
  };
}
