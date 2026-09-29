import type { Feature } from "geojson";

import ColumnSelect from "../../../components/ui/column-select";
import ImportDialog from "../../../components/ui/import-dialog";
import { TABULAR_FILE_EXTENSIONS } from "../../../constants/files";
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
  const geometryCounts =
    kind === "shapefile" ? summarizeGeometry(shapefileFeatures) : {};
  const canConfirm =
    (kind === "csv" && validCount > 0) ||
    (kind === "shapefile" && shapefileFeatures.length > 0);

  return (
    <ImportDialog
      isOpen={isOpen}
      title="Import Dataset"
      fileName={fileName}
      error={error}
      acceptExtensions={[...TABULAR_FILE_EXTENSIONS, ".zip"]}
      acceptLabel="CSV, Excel (.xlsx), or zipped Shapefile (.zip)"
      onFileSelect={onFileSelect}
      onClose={onClose}
      onConfirm={onConfirm}
      canConfirm={canConfirm}
    >
      {kind === "csv" ? (
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
              onChange={(value) => onMappingChange({ ...mapping, lat: value })}
            />
            <ColumnSelect
              label="Longitude column"
              headers={headers}
              value={mapping.lng}
              onChange={(value) => onMappingChange({ ...mapping, lng: value })}
            />
            <ColumnSelect
              label="Name column (optional)"
              headers={headers}
              value={mapping.name}
              onChange={(value) => onMappingChange({ ...mapping, name: value })}
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
    </ImportDialog>
  );
}
