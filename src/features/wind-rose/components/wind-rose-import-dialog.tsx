import { Upload, X } from "lucide-react";
import type { ChangeEvent } from "react";

import { TABULAR_FILE_EXTENSIONS } from "../../../constants/files";
import type { WindRoseColumnMapping } from "../hooks/use-wind-rose-import";

type WindRoseImportDialogProps = {
  isOpen: boolean;
  fileName: string | null;
  error: string | null;
  headers: string[];
  rowCount: number;
  validCount: number;
  mapping: WindRoseColumnMapping;
  onMappingChange: (mapping: WindRoseColumnMapping) => void;
  onFileSelect: (file: File) => void;
  onConfirm: () => void;
  onClose: () => void;
};

export default function WindRoseImportDialog({
  isOpen,
  fileName,
  error,
  headers,
  rowCount,
  validCount,
  mapping,
  onMappingChange,
  onFileSelect,
  onConfirm,
  onClose,
}: WindRoseImportDialogProps) {
  if (!isOpen) return null;

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const canConfirm = validCount > 0;
  const isExcel = fileName?.toLowerCase().endsWith(".xlsx") ?? false;
  const missingFields = [
    !mapping.direction && "Direction",
    !mapping.magnitude && "Magnitude",
  ].filter(Boolean) as string[];

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Import Wind/Wave Dataset
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700"
          >
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {!fileName ? (
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 secondary-text hover:border-accent/40 hover:text-accent">
              <Upload size={22} />
              Click to select a file
              <span className="text-xs text-slate-400">
                CSV or Excel (.xlsx)
              </span>
              <input
                type="file"
                accept={TABULAR_FILE_EXTENSIONS.join(",")}
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="truncate body-text">
                  <span className="font-medium text-slate-900">{fileName}</span>{" "}
                  — {rowCount} rows
                </p>
                {isExcel && (
                  <p className="mt-0.5 text-xs text-slate-500">
                    The first worksheet that contains data is used.
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <ColumnSelect
                  label="Direction"
                  headers={headers}
                  value={mapping.direction}
                  onChange={(value) =>
                    onMappingChange({ ...mapping, direction: value })
                  }
                />
                <ColumnSelect
                  label="Magnitude"
                  headers={headers}
                  value={mapping.magnitude}
                  onChange={(value) =>
                    onMappingChange({ ...mapping, magnitude: value })
                  }
                />
                <ColumnSelect
                  label="Timestamp (optional)"
                  headers={headers}
                  value={mapping.timestamp}
                  onChange={(value) =>
                    onMappingChange({ ...mapping, timestamp: value })
                  }
                  allowEmpty
                />
              </div>

              <p className="text-xs text-slate-500">
                {validCount} of {rowCount} rows have valid directional values.
              </p>

              {missingFields.length > 0 && (
                <p className="text-xs text-amber-600">
                  No column found for: {missingFields.join(", ")}. Please select
                  the corresponding column manually above.
                </p>
              )}
            </div>
          )}

          {error && <p className="mt-3 text-sm text-red-600">{error}</p>}
        </div>

        <div className="flex shrink-0 justify-end gap-2 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-slate-200 px-4 py-2 body-text hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!canConfirm}
            onClick={onConfirm}
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
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
    <label className="block label-text">
      {label}
      <select
        value={value ?? ""}
        onChange={(event) => onChange(event.target.value || null)}
        className="mt-1 w-full rounded-lg border border-slate-200 px-3 py-2 text-sm text-slate-800 focus:border-accent focus:outline-none"
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
