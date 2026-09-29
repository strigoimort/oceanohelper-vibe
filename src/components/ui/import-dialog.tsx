import { Upload, X } from "lucide-react";
import type { ChangeEvent, ReactNode } from "react";

type ImportDialogProps = {
  isOpen: boolean;
  title: string;
  fileName: string | null;
  error: string | null;
  acceptExtensions: string[];
  acceptLabel: string;
  onFileSelect: (file: File) => void;
  onClose: () => void;
  onConfirm: () => void;
  canConfirm: boolean;
  confirmLabel?: string;
  children?: ReactNode;
};

/**
 * Shared shell for every dataset import dialog (Geospatial, Particle
 * Tracer, Wind Rose). Owns sizing, the dropzone, and the footer buttons so
 * all three stay visually identical; each module supplies its own mapping
 * UI as children once a file is selected.
 */
export default function ImportDialog({
  isOpen,
  title,
  fileName,
  error,
  acceptExtensions,
  acceptLabel,
  onFileSelect,
  onClose,
  onConfirm,
  canConfirm,
  confirmLabel = "Import",
  children,
}: ImportDialogProps) {
  if (!isOpen) return null;

  const handleFileInput = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) onFileSelect(file);
  };

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-slate-900/40 px-4 py-8">
      <div className="flex max-h-[85vh] w-full max-w-xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
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
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 py-10 text-sm text-slate-500 hover:border-accent/40 hover:text-accent">
              <Upload size={22} />
              Click to select a file
              <span className="text-xs text-slate-400">{acceptLabel}</span>
              <input
                type="file"
                accept={acceptExtensions.join(",")}
                className="hidden"
                onChange={handleFileInput}
              />
            </label>
          ) : (
            children
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
            className="rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-40"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
