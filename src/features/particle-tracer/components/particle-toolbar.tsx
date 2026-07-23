import { Download, Trash2, Upload } from "lucide-react";

import type { BasemapId } from "../../../constants/basemaps";
import GeospatialBasemapSwitcher from "../../geospatial-workspace/components/geospatial-basemap-switcher";

type ParticleToolbarProps = {
  onImportClick: () => void;
  onClearAll: () => void;
  onExportGeoJson: () => void;
  hasDatasets: boolean;
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
};

export default function ParticleToolbar({
  onImportClick,
  onClearAll,
  onExportGeoJson,
  hasDatasets,
  basemap,
  onBasemapChange,
}: ParticleToolbarProps) {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <div className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 shadow-lg">
        <button
          type="button"
          title="Import trajectory dataset"
          onClick={onImportClick}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-white text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        >
          <Upload size={18} />
        </button>

        <button
          type="button"
          title="Export as GeoJSON"
          disabled={!hasDatasets}
          onClick={onExportGeoJson}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-white text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Download size={18} />
        </button>

        <button
          type="button"
          title="Clear all datasets"
          disabled={!hasDatasets}
          onClick={onClearAll}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-white text-slate-700 transition hover:border-slate-200 hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Trash2 size={18} />
        </button>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <GeospatialBasemapSwitcher value={basemap} onChange={onBasemapChange} />
      </div>
    </div>
  );
}
