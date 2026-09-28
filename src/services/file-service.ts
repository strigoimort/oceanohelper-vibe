import Papa from "papaparse";
import shp from "shpjs";
import type { CellObject, WorkSheet } from "xlsx";
import type { FeatureCollection } from "geojson";

import { TABULAR_FILE_EXTENSIONS } from "../constants/files";

export type ParsedTable = {
  headers: string[];
  rows: Record<string, string>[];
};

type SpreadsheetModule = typeof import("xlsx");

// The SSF date helpers exist at runtime but are not fully typed.
type SsfUtils = {
  is_date: (format: string) => boolean;
  parse_date_code: (
    serial: number,
  ) => {
    y: number;
    m: number;
    d: number;
    H: number;
    M: number;
    S: number;
  } | null;
};

export function isTabularFile(file: File): boolean {
  const name = file.name.toLowerCase();
  return TABULAR_FILE_EXTENSIONS.some((extension) => name.endsWith(extension));
}

export function parseCsvFile(file: File): Promise<ParsedTable> {
  return new Promise((resolve, reject) => {
    Papa.parse<Record<string, string>>(file, {
      header: true,
      skipEmptyLines: true,
      complete: (result) => {
        resolve({ headers: result.meta.fields ?? [], rows: result.data });
      },
      error: (error) => reject(error),
    });
  });
}

function pad(value: number): string {
  return String(Math.floor(value)).padStart(2, "0");
}

function cellToText(cell: CellObject | undefined, ssf: SsfUtils): string {
  if (!cell || cell.v === undefined || cell.t === "e") return "";

  if (
    cell.t === "n" &&
    typeof cell.v === "number" &&
    typeof cell.z === "string" &&
    ssf.is_date(cell.z)
  ) {
    const date = ssf.parse_date_code(cell.v);
    if (date) {
      // Excel dates carry no time zone; they are treated as UTC like the
      // rest of the app (see docs/project-conventions.md).
      return `${date.y}-${pad(date.m)}-${pad(date.d)}T${pad(date.H)}:${pad(date.M)}:${pad(date.S)}Z`;
    }
  }

  return String(cell.v);
}

function sheetToRows(
  sheet: WorkSheet,
  xlsx: SpreadsheetModule,
  ssf: SsfUtils,
): string[][] {
  const reference = sheet["!ref"];
  if (!reference) return [];

  const range = xlsx.utils.decode_range(reference);
  const rows: string[][] = [];

  for (let r = range.s.r; r <= range.e.r; r += 1) {
    const row: string[] = [];
    for (let c = range.s.c; c <= range.e.c; c += 1) {
      const cell = sheet[xlsx.utils.encode_cell({ r, c })] as
        | CellObject
        | undefined;
      row.push(cellToText(cell, ssf));
    }
    rows.push(row);
  }

  return rows;
}

function normalizeHeaders(cells: string[]): string[] {
  const seen = new Map<string, number>();

  return cells.map((cell, index) => {
    const base = cell.trim() || `Column ${index + 1}`;
    const count = seen.get(base) ?? 0;
    seen.set(base, count + 1);
    return count === 0 ? base : `${base}_${count + 1}`;
  });
}

function rowsToTable(rows: string[][]): ParsedTable | null {
  const [headerRow, ...dataRows] = rows;
  if (!headerRow) return null;

  const lastColumn = headerRow.reduce(
    (last, cell, index) => (cell.trim() ? index : last),
    -1,
  );
  if (lastColumn < 0) return null;

  const headers = normalizeHeaders(headerRow.slice(0, lastColumn + 1));
  const records = dataRows
    .filter((row) => row.some((cell) => cell.trim() !== ""))
    .map((row) =>
      Object.fromEntries(
        headers.map((header, index): [string, string] => [
          header,
          row[index] ?? "",
        ]),
      ),
    );

  return { headers, rows: records };
}

/** Reads the first worksheet that contains data; row 1 is the header. */
export async function parseExcelFile(file: File): Promise<ParsedTable> {
  // Loaded on demand so the spreadsheet parser only ships when it is needed.
  const xlsx = await import("xlsx");
  const ssf = xlsx.SSF as unknown as SsfUtils;

  const workbook = xlsx.read(await file.arrayBuffer(), {
    type: "array",
    cellNF: true,
  });

  for (const sheetName of workbook.SheetNames) {
    const table = rowsToTable(
      sheetToRows(workbook.Sheets[sheetName], xlsx, ssf),
    );
    if (table && table.rows.length > 0) return table;
  }

  return { headers: [], rows: [] };
}

export function parseTabularFile(file: File): Promise<ParsedTable> {
  return file.name.toLowerCase().endsWith(".xlsx")
    ? parseExcelFile(file)
    : parseCsvFile(file);
}

/**
 * Parses a zipped Shapefile (.shp + .shx + .dbf, optionally .prj) into one
 * or more GeoJSON FeatureCollections. shpjs automatically reprojects
 * coordinates to WGS84 when a .prj file is present.
 */
export async function parseShapefile(file: File): Promise<FeatureCollection[]> {
  const buffer = await file.arrayBuffer();
  const result = await shp(buffer);
  return Array.isArray(result) ? result : [result];
}

export function downloadBlobFile(filename: string, blob: Blob) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

export function downloadTextFile(
  filename: string,
  content: string,
  mimeType: string,
) {
  downloadBlobFile(filename, new Blob([content], { type: mimeType }));
}

// export async function exportElementAsPng(
//   element: HTMLElement,
//   filename: string,
// ) {
//   const { default: html2canvas } = await import("html2canvas");

//   const canvas = await html2canvas(element, {
//     useCORS: true,
//     backgroundColor: null,
//   });

//   const blob: Blob | null = await new Promise((resolve) =>
//     canvas.toBlob(resolve, "image/png"),
//   );
//   if (!blob) throw new Error("Failed to generate PNG.");

//   downloadBlobFile(filename, blob);
// }
