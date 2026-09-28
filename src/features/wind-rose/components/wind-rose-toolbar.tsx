import { Upload, Download } from "lucide-react";

type WindRoseToolbarProps = {
  onImportClick: () => void;
  onExportCsv: () => void;
  onExportSvg: () => void;
  hasData: boolean;
};

export default function WindRoseToolbar({
  onImportClick,
  onExportCsv,
  onExportSvg,
  hasData,
}: WindRoseToolbarProps) {
  return (
    <div className="flex max-w-full flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white/95 p-2 shadow-sm backdrop-blur">
      <button
        type="button"
        onClick={onImportClick}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
      >
        <Upload size={16} />
        Import CSV
      </button>
      <button
        type="button"
        onClick={onExportCsv}
        disabled={!hasData}
        className="inline-flex items-center gap-2 rounded-xl bg-accent px-3 py-2 text-sm font-medium text-white transition hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={16} />
        Export CSV
      </button>
      <button
        type="button"
        onClick={onExportSvg}
        disabled={!hasData}
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <Download size={16} />
        Export SVG
      </button>
    </div>
  );
}
