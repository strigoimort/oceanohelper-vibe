import Papa from "papaparse";

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

/**
 * Renders a DOM element (typically the Leaflet map container) to a PNG and
 * triggers a download. Note: raster basemap tiles that don't send CORS
 * headers (e.g. the default OpenStreetMap "Streets" tiles) may fail to
 * render into the canvas — CARTO (Dark/Terrain) and Esri (Satellite/Ocean)
 * tiles are more reliable for this.
 */
export async function exportElementAsPng(
  element: HTMLElement,
  filename: string,
) {
  const { default: html2canvas } = await import("html2canvas");

  const canvas = await html2canvas(element, {
    useCORS: true,
    backgroundColor: null,
  });

  const blob: Blob | null = await new Promise((resolve) =>
    canvas.toBlob(resolve, "image/png"),
  );

  if (!blob) {
    throw new Error("Failed to generate PNG.");
  }

  downloadBlobFile(filename, blob);
}
