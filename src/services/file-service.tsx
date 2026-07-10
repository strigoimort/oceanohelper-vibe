import Papa from "papaparse";
import shp from "shpjs";
import type { FeatureCollection } from "geojson";

export type ParsedCsv = {
  headers: string[];
  rows: Record<string, string>[];
};

export function parseCsvFile(file: File): Promise<ParsedCsv> {
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

function downloadBlobFile(filename: string, blob: Blob) {
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
