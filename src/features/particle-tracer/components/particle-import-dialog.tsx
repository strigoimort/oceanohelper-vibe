import { Upload, X } from "lucide-react";
import type { ChangeEvent } from "react";

import type { ParticleColumnMapping } from "../hooks/use-particle-import";

type ParticleImportDialogProps = {
  isOpen: boolean;
  fileName: string | null;
  error: string | null;
  headers: string[];
  rowCount: number;
  validCount: number;
  mapping: ParticleColumnMapping;
  onMappingChange: (mapping: ParticleColumnMapping) => void;
  onFileSelect: (file: File) => void;
  onConfirm: () => void;
  onClose: () => void;
};

export default function ParticleImportDialog({
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
}: ParticleImportDialogProps) {
  if (!isOpen) return null;

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  const canConfirm = validCount > 0;

  const missingFields = [
    !mapping.particleId && "Particle ID",
    !mapping.lat && "Latitude",
    !mapping.lng && "Longitude",
    !mapping.timestamp && "Timestamp",
  ].filter(Boolean) as string[];

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      {/* flex-col + shrink-0 header/footer + scrollable body keeps the
          dialog from being clipped even with 6 mapping fields visible. */}
      <div className="flex max-h-[85vh] w-full max-w-2xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">
            Import Trajectory Dataset
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
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-sm text-slate-500 hover:border-sky-300 hover:text-sky-600">
              <Upload size={22} />
              Click to select a file
              <span className="text-xs text-slate-400">CSV file</span>
              <input
                type="file"
                accept=".csv"
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          ) : (
            <div className="space-y-4">
              <p className="truncate text-sm text-slate-600">
                <span className="font-medium text-slate-900">{fileName}</span> —{" "}
                {rowCount} rows
              </p>

              {/* Required fields left column, optional fields right column
                  — halves the vertical footprint vs a single stacked list. */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                <ColumnSelect
                  label="Particle ID column"
                  headers={headers}
                  value={mapping.particleId}
                  onChange={(value) =>
                    onMappingChange({ ...mapping, particleId: value })
                  }
                />
                <ColumnSelect
                  label="Timestamp column"
                  headers={headers}
                  value={mapping.timestamp}
                  onChange={(value) =>
                    onMappingChange({ ...mapping, timestamp: value })
                  }
                />
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
                  label="Speed column (optional)"
                  headers={headers}
                  value={mapping.speed}
                  onChange={(value) =>
                    onMappingChange({ ...mapping, speed: value })
                  }
                  allowEmpty
                />
                <ColumnSelect
                  label="Direction column (optional)"
                  headers={headers}
                  value={mapping.direction}
                  onChange={(value) =>
                    onMappingChange({ ...mapping, direction: value })
                  }
                  allowEmpty
                />
              </div>

              <p className="text-xs text-slate-500">
                {validCount} of {rowCount} rows have valid particle records.
              </p>

              {missingFields.length > 0 && (
                <p className="text-xs text-amber-600">
                  Belum ada kolom untuk: {missingFields.join(", ")}. Pilih
                  kolomnya secara manual di atas.
                </p>
              )}

              {missingFields.length === 0 && validCount === 0 && (
                <p className="text-xs text-red-600">
                  Kolom sudah terpetakan, tapi tidak ada baris yang valid. Cek
                  isi Latitude/Longitude dan format Timestamp.
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
