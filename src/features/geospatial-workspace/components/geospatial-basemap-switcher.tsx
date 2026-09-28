import { useState } from "react";
import { Layers as LayersIcon, Check } from "lucide-react";

import { BASEMAPS, type BasemapId } from "../../../constants/basemaps";

type GeospatialBasemapSwitcherProps = {
  value: BasemapId;
  onChange: (id: BasemapId) => void;
};

export default function GeospatialBasemapSwitcher({
  value,
  onChange,
}: GeospatialBasemapSwitcherProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button
        type="button"
        title="Change basemap"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition ${
          isOpen
            ? "border-accent/20 bg-accent-soft text-accent"
            : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        }`}
      >
        <LayersIcon size={18} />
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          />
          <div className="absolute bottom-14 left-1/2 z-20 w-44 -translate-x-1/2 overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl">
            {Object.entries(BASEMAPS).map(([id, config]) => (
              <button
                key={id}
                type="button"
                onClick={() => {
                  onChange(id as BasemapId);
                  setIsOpen(false);
                }}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition ${
                  id === value
                    ? "bg-accent-soft text-accent"
                    : "text-slate-700 hover:bg-slate-50"
                }`}
              >
                {config.name}
                {id === value && <Check size={14} />}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
