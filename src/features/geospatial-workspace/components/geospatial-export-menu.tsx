import { useState } from "react";
import { Download, FileJson, Image as ImageIcon } from "lucide-react";

type GeospatialExportMenuProps = {
  disabled?: boolean;
  onExportGeoJson: () => void;
  onExportPng: () => void;
};

export default function GeospatialExportMenu({
  disabled,
  onExportGeoJson,
  onExportPng,
}: GeospatialExportMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        title="Export"
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition disabled:cursor-not-allowed disabled:opacity-40 ${
          isOpen
            ? "border-sky-200 bg-sky-100 text-sky-700"
            : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <Download size={18} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-14 left-1/2 z-20 w-40 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            <button
              type="button"
              onClick={() => {
                onExportGeoJson();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <FileJson size={14} /> GeoJSON
            </button>
            <button
              type="button"
              onClick={() => {
                onExportPng();
                setIsOpen(false);
              }}
              className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-slate-700 hover:bg-slate-50"
            >
              <ImageIcon size={14} /> PNG
            </button>
          </div>
        </>
      )}
    </div>
  );
}
