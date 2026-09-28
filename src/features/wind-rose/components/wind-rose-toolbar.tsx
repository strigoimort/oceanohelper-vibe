import { Upload } from "lucide-react";

import type { WindRoseExportFormat } from "../hooks/use-wind-rose-export";
import WindRoseExportMenu from "./wind-rose-export-menu";

type WindRoseToolbarProps = {
  onImportClick: () => void;
  onExport: (format: WindRoseExportFormat) => void;
  hasData: boolean;
};

export default function WindRoseToolbar({
  onImportClick,
  onExport,
  hasData,
}: WindRoseToolbarProps) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-2 shadow-sm">
      <button
        type="button"
        onClick={onImportClick}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <Upload size={16} />
        Import data
      </button>

      <WindRoseExportMenu disabled={!hasData} onExport={onExport} />
    </div>
  );
}
