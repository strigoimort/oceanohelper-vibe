import ColumnSelect from "../../../components/ui/column-select";
import ImportDialog from "../../../components/ui/import-dialog";
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
  const canConfirm = validCount > 0;
  const isExcel = fileName?.toLowerCase().endsWith(".xlsx") ?? false;
  const missingFields = [
    !mapping.direction && "Direction",
    !mapping.magnitude && "Magnitude",
  ].filter(Boolean) as string[];

  return (
    <ImportDialog
      isOpen={isOpen}
      title="Import Wind/Wave Dataset"
      fileName={fileName}
      error={error}
      acceptExtensions={TABULAR_FILE_EXTENSIONS}
      acceptLabel="CSV or Excel (.xlsx)"
      onFileSelect={onFileSelect}
      onClose={onClose}
      onConfirm={onConfirm}
      canConfirm={canConfirm}
    >
      <div className="space-y-4">
        <div>
          <p className="truncate text-sm text-slate-600">
            <span className="font-medium text-slate-900">{fileName}</span> —{" "}
            {rowCount} rows
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
            No column found for: {missingFields.join(", ")}. Please select the
            corresponding column manually above.
          </p>
        )}
      </div>
    </ImportDialog>
  );
}
