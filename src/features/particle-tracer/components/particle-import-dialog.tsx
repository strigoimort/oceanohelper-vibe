import ColumnSelect from "../../../components/ui/column-select";
import ImportDialog from "../../../components/ui/import-dialog";
import { TABULAR_FILE_EXTENSIONS } from "../../../constants/files";
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
  const canConfirm = validCount > 0;

  const missingFields = [
    !mapping.particleId && "Particle ID",
    !mapping.lat && "Latitude",
    !mapping.lng && "Longitude",
    !mapping.timestamp && "Timestamp",
  ].filter(Boolean) as string[];

  return (
    <ImportDialog
      isOpen={isOpen}
      title="Import Trajectory Dataset"
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
        <p className="truncate text-sm text-slate-600">
          <span className="font-medium text-slate-900">{fileName}</span> —{" "}
          {rowCount} rows
        </p>

        {/* Required fields left column, optional fields right column —
            halves the vertical footprint vs a single stacked list. */}
        <div className="grid grid-cols-2 gap-x-4 gap-y-3">
          <ColumnSelect
            label="Particle ID"
            headers={headers}
            value={mapping.particleId}
            onChange={(value) =>
              onMappingChange({ ...mapping, particleId: value })
            }
          />
          <ColumnSelect
            label="Timestamp"
            headers={headers}
            value={mapping.timestamp}
            onChange={(value) =>
              onMappingChange({ ...mapping, timestamp: value })
            }
          />
          <ColumnSelect
            label="Latitude"
            headers={headers}
            value={mapping.lat}
            onChange={(value) => onMappingChange({ ...mapping, lat: value })}
          />
          <ColumnSelect
            label="Longitude"
            headers={headers}
            value={mapping.lng}
            onChange={(value) => onMappingChange({ ...mapping, lng: value })}
          />
          <ColumnSelect
            label="Speed (optional)"
            headers={headers}
            value={mapping.speed}
            onChange={(value) => onMappingChange({ ...mapping, speed: value })}
            allowEmpty
          />
          <ColumnSelect
            label="Direction (optional)"
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
            No column found for: {missingFields.join(", ")}. Please select the
            corresponding column manually above.
          </p>
        )}

        {missingFields.length === 0 && validCount === 0 && (
          <p className="text-xs text-red-600">
            The columns have been mapped, but no valid rows were found. Please
            check the Latitude/Longitude values and the Timestamp format.
          </p>
        )}
      </div>
    </ImportDialog>
  );
}
