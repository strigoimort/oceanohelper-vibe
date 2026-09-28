const encoder = new TextEncoder();

type JpegPdfOptions = {
  jpeg: Uint8Array;
  imageWidth: number;
  imageHeight: number;
  pageWidth: number;
  pageHeight: number;
  margin: number;
};

/** Builds a single-page PDF with a JPEG scaled to fit inside the page margins. */
export function buildJpegPdf({
  jpeg,
  imageWidth,
  imageHeight,
  pageWidth,
  pageHeight,
  margin,
}: JpegPdfOptions): Blob {
  const scale = Math.min(
    (pageWidth - margin * 2) / imageWidth,
    (pageHeight - margin * 2) / imageHeight,
  );
  const drawWidth = imageWidth * scale;
  const drawHeight = imageHeight * scale;
  const drawX = (pageWidth - drawWidth) / 2;
  const drawY = (pageHeight - drawHeight) / 2;

  const content = `q ${drawWidth.toFixed(2)} 0 0 ${drawHeight.toFixed(2)} ${drawX.toFixed(2)} ${drawY.toFixed(2)} cm /Im0 Do Q`;

  const chunks: Uint8Array[] = [];
  const offsets: number[] = [];
  let length = 0;

  const write = (data: string | Uint8Array) => {
    const bytes = typeof data === "string" ? encoder.encode(data) : data;
    chunks.push(bytes);
    length += bytes.length;
  };

  const startObject = (id: number) => {
    offsets[id] = length;
    write(`${id} 0 obj\n`);
  };

  write("%PDF-1.4\n");

  startObject(1);
  write("<< /Type /Catalog /Pages 2 0 R >>\nendobj\n");

  startObject(2);
  write("<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n");

  startObject(3);
  write(
    `<< /Type /Page /Parent 2 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /XObject << /Im0 4 0 R >> >> /Contents 5 0 R >>\nendobj\n`,
  );

  startObject(4);
  write(
    `<< /Type /XObject /Subtype /Image /Width ${imageWidth} /Height ${imageHeight} /ColorSpace /DeviceRGB /BitsPerComponent 8 /Filter /DCTDecode /Length ${jpeg.length} >>\nstream\n`,
  );
  write(jpeg);
  write("\nendstream\nendobj\n");

  startObject(5);
  write(
    `<< /Length ${encoder.encode(content).length} >>\nstream\n${content}\nendstream\nendobj\n`,
  );

  const objectCount = 6;
  const xrefOffset = length;
  write(`xref\n0 ${objectCount}\n0000000000 65535 f \n`);
  for (let id = 1; id < objectCount; id += 1) {
    write(`${String(offsets[id]).padStart(10, "0")} 00000 n \n`);
  }
  write(
    `trailer\n<< /Size ${objectCount} /Root 1 0 R >>\nstartxref\n${xrefOffset}\n%%EOF\n`,
  );

  const output = new Uint8Array(length);
  let cursor = 0;
  chunks.forEach((chunk) => {
    output.set(chunk, cursor);
    cursor += chunk.length;
  });

  return new Blob([output], { type: "application/pdf" });
}
