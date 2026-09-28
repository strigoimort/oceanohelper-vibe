import { useCallback, useState } from "react";

import { parseCsvFile } from "../../../services/file-service";
import {
  detectWindRoseColumnMapping,
  type WindRoseColumnMapping,
} from "../../../utils/wind-rose-column-mapping";
import type { WindRoseRecord } from "../../../utils/wind-rose";

export type { WindRoseColumnMapping };

const EMPTY_MAPPING: WindRoseColumnMapping = {
  direction: null,
  magnitude: null,
  timestamp: null,
};

// Empty cells must not become 0, and Excel with an Indonesian locale
// exports decimal commas ("12,5").
function parseNumericCell(value: string | undefined): number {
  if (value === undefined || value.trim() === "") return Number.NaN;
  return Number(value.trim().replace(",", "."));
}

export function useWindRoseImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<WindRoseColumnMapping>(EMPTY_MAPPING);

  const open = useCallback(() => setIsOpen(true), []);

  const reset = useCallback(() => {
    setIsOpen(false);
    setFileName(null);
    setError(null);
    setHeaders([]);
    setRows([]);
    setMapping(EMPTY_MAPPING);
  }, []);

  const loadFile = useCallback(async (file: File) => {
    setError(null);
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Unsupported file type. Use a CSV file.");
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
      setMapping(detectWindRoseColumnMapping(parsedHeaders));
    } catch {
      setError("Failed to read the CSV file. Please check the format.");
    }
  }, []);

  const validRecords = rows.reduce<WindRoseRecord[]>((accumulator, row) => {
    if (!mapping.direction || !mapping.magnitude) {
      return accumulator;
    }

    const direction = parseNumericCell(row[mapping.direction]);
    const magnitude = parseNumericCell(row[mapping.magnitude]);
    const timestampValue = mapping.timestamp ? row[mapping.timestamp] : null;

    if (Number.isNaN(direction) || Number.isNaN(magnitude)) {
      return accumulator;
    }

    accumulator.push({
      direction,
      magnitude,
      timestamp: timestampValue ?? null,
    });

    return accumulator;
  }, []);

  return {
    isOpen,
    open,
    reset,
    loadFile,
    fileName,
    error,
    headers,
    rows,
    mapping,
    setMapping,
    validRecords,
  };
}
