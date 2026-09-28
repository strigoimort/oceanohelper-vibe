import { buildJpegPdf } from "../utils/pdf";

const PDF_RENDER_SCALE = 1.5;
const PDF_JPEG_QUALITY = 0.95;
// A4 landscape in PDF points (1/72 inch).
const PDF_PAGE = { width: 841.89, height: 595.28, margin: 36 };

function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () =>
      reject(new Error("Failed to render the chart image."));
    image.src = url;
  });
}

async function rasterizeSvg(
  svgMarkup: string,
  scale: number,
): Promise<HTMLCanvasElement> {
  const url = URL.createObjectURL(
    new Blob([svgMarkup], { type: "image/svg+xml;charset=utf-8" }),
  );

  try {
    const image = await loadImage(url);
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(image.naturalWidth * scale);
    canvas.height = Math.round(image.naturalHeight * scale);

    const context = canvas.getContext("2d");
    if (!context) throw new Error("Canvas is not supported in this browser.");

    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.drawImage(image, 0, 0, canvas.width, canvas.height);

    return canvas;
  } finally {
    URL.revokeObjectURL(url);
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality?: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) =>
        blob ? resolve(blob) : reject(new Error("Failed to encode the image.")),
      type,
      quality,
    );
  });
}

export async function svgToPngBlob(svgMarkup: string): Promise<Blob> {
  const canvas = await rasterizeSvg(svgMarkup, 1);
  return canvasToBlob(canvas, "image/png");
}

export async function svgToPdfBlob(svgMarkup: string): Promise<Blob> {
  const canvas = await rasterizeSvg(svgMarkup, PDF_RENDER_SCALE);
  const jpegBlob = await canvasToBlob(canvas, "image/jpeg", PDF_JPEG_QUALITY);
  const jpeg = new Uint8Array(await jpegBlob.arrayBuffer());

  return buildJpegPdf({
    jpeg,
    imageWidth: canvas.width,
    imageHeight: canvas.height,
    pageWidth: PDF_PAGE.width,
    pageHeight: PDF_PAGE.height,
    margin: PDF_PAGE.margin,
  });
}
