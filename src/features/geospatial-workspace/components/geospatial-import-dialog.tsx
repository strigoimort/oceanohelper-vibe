import { Upload, X } from "lucide-react";
import type { ChangeEvent } from "react";
import type { Feature } from "geojson";

import type { ColumnMapping, ImportKind } from "../hooks/use-dataset-import";

type GeospatialImportDialogProps = {
  isOpen: boolean;
  kind: ImportKind;
  fileName: string | null;
  error: string | null;
  onFileSelect: (file: File) => void;
  onConfirm: () => void;
  onClose: () => void;
  // csv
  headers: string[];
  rowCount: number;
  validCount: number;
  mapping: ColumnMapping;
  onMappingChange: (mapping: ColumnMapping) => void;
  // shapefile
  shapefileFeatures: Feature[];
};

function summarizeGeometry(features: Feature[]) {
  const counts: Record<string, number> = {};
  features.forEach((f) => {
    const type = f.geometry?.type ?? "Unknown";
    counts[type] = (counts[type] ?? 0) + 1;
  });
  return counts;
}

export default function GeospatialImportDialog({
  isOpen,
  kind,
  fileName,
  error,
  onFileSelect,
  onConfirm,
  onClose,
  headers,
  rowCount,
  validCount,
  mapping,
  onMappingChange,
  shapefileFeatures,
}: GeospatialImportDialogProps) {
  if (!isOpen) return null;

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const geometryCounts =
    kind === "shapefile" ? summarizeGeometry(shapefileFeatures) : {};
  const canConfirm =
    (kind === "csv" && validCount > 0) ||
    (kind === "shapefile" && shapefileFeatures.length > 0);

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-slate-900">
            Import Dataset
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        {!fileName ? (
          <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-sm text-slate-500 hover:border-sky-300 hover:text-sky-600">
            <Upload size={22} />
            Click to select a file
            <span className="text-xs text-slate-400">
              CSV or zipped Shapefile (.zip)
            </span>
            <input
              type="file"
              accept=".csv,.zip"
              className="hidden"
              onChange={handleFileInput}
            />
          </label>
        ) : kind === "csv" ? (
          <div className="space-y-4">
            <p className="truncate text-sm text-slate-600">
              <span className="font-medium text-slate-900">{fileName}</span> —{" "}
              {rowCount} rows
            </p>

            <div className="space-y-3">
              <ColumnSelect
                label="Latitude column"
                headers={headers}
                value={mapping.lat}
                onChange={(value) =>
                  onMappingChange({ ...mapping, lat: value })
                }
              />
              <ColumnSelect
                label="Longitude column"
                headers={headers}
                value={mapping.lng}
                onChange={(value) =>
                  onMappingChange({ ...mapping, lng: value })
                }
              />
              <ColumnSelect
                label="Name column (optional)"
                headers={headers}
                value={mapping.name}
                onChange={(value) =>
                  onMappingChange({ ...mapping, name: value })
                }
                allowEmpty
              />
            </div>

            <p className="text-xs text-slate-500">
              {validCount} of {rowCount} rows have valid coordinates.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="truncate text-sm text-slate-600">
              <span className="font-medium text-slate-900">{fileName}</span> —{" "}
              {shapefileFeatures.length} features
            </p>

            <div className="space-y-1 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
              {Object.entries(geometryCounts).map(([type, count]) => (
                <p key={type}>
                  {type} — {count}
                </p>
              ))}
            </div>
          </div>
        )}

        {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="rounded-lg bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:opacity-40"
          >
            Import
          </button>
        </div>
      </div>
    </div>
  );
}

type ColumnSelectProps = {
  label: string;
  headers: string[];
  value: string | null;
  onChange: (value: string | null) => void;
  allowEmpty?: boolean;
};

function ColumnSelect({
  label,
  headers,
  value,
  onChange,
  allowEmpty,
}: ColumnSelectProps) {
  return (
    <label className="block text-xs font-medium text-slate-500">
      {label}
      <select
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || null)}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-sky-500 focus:outline-none"
      >
        {allowEmpty && <option value="">— None —</option>}
        {!allowEmpty && !value && <option value="">Select column…</option>}
        {headers.map((header) => (
          <option key={header} value={header}>
            {header}
          </option>
        ))}
      </select>
    </label>
  );
}
