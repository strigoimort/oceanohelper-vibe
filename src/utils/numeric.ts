/**
 * Parses a spreadsheet cell into a number. Blank cells are NaN — never
 * silently 0 — and a decimal comma ("12,5") is normalized to a dot for
 * locales that export Excel/CSV with Indonesian number formatting.
 */
export function parseNumericCell(value: string | undefined): number {
  if (value === undefined || value.trim() === "") return Number.NaN;
  return Number(value.trim().replace(",", "."));
}
