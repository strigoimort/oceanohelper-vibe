import { useCallback, useState } from "react";

import { parseCsvFile } from "../../../services/file-service";
import {
  detectParticleColumnMapping,
  type ParticleColumnMapping,
} from "../../../utils/particle-column-mapping";
import type { RawParticleRecord } from "../../../types/particle";
import { parseTimestamp } from "../../../utils/particle-tracer";

export type { ParticleColumnMapping };

const EMPTY_MAPPING: ParticleColumnMapping = {
  particleId: null,
  lat: null,
  lng: null,
  timestamp: null,
  speed: null,
  direction: null,
};

/** Handles CSV loading, column mapping, and row validation for the import dialog. */
export function useParticleImport() {
  const [isOpen, setIsOpen] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [mapping, setMapping] = useState<ParticleColumnMapping>(EMPTY_MAPPING);

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
      setMapping(detectParticleColumnMapping(parsedHeaders));
    } catch {
      setError("Failed to read the CSV file. Please check the format.");
    }
  }, []);

  const validRecords: RawParticleRecord[] = rows.reduce<RawParticleRecord[]>(
    (acc, row) => {
      const { particleId, lat, lng, timestamp, speed, direction } = mapping;
      if (!particleId || !lat || !lng || !timestamp) return acc;

      const latValue = Number(row[lat]);
      const lngValue = Number(row[lng]);
      const timestampValue = row[timestamp];
      const time = parseTimestamp(timestampValue);

      if (
        Number.isNaN(latValue) ||
        Number.isNaN(lngValue) ||
        Number.isNaN(time)
      ) {
        return acc;
      }

      const record: RawParticleRecord = {
        particleId: row[particleId],
        lat: latValue,
        lng: lngValue,
        timestamp: timestampValue,
      };

      if (speed) {
        const speedValue = Number(row[speed]);
        if (!Number.isNaN(speedValue)) record.speed = speedValue;
      }

      if (direction) {
        const directionValue = Number(row[direction]);
        if (!Number.isNaN(directionValue)) record.direction = directionValue;
      }

      acc.push(record);
      return acc;
    },
    [],
  );

  return {
    isOpen,
    open,
    reset,
    fileName,
    error,
    loadFile,
    headers,
    rows,
    mapping,
    setMapping,
    validRecords,
  };
}
