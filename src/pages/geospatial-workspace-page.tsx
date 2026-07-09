import { useState } from "react";

import GeospatialMap from "../features/geospatial-workspace/components/geospatial-map";
import GeospatialPropertiesPanel from "../features/geospatial-workspace/components/geospatial-properties-panel";
import GeospatialToolbar from "../features/geospatial-workspace/components/geospatial-toolbar";

export default function GeospatialWorkspacePage() {
  const [cursor, setCursor] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [zoom, setZoom] = useState(2);

  return (
    <div className="flex h-full w-full min-h-0 overflow-hidden bg-slate-50">
      <div className="flex flex-1 min-h-0 flex-col">
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0">
            <GeospatialMap onCursorMove={setCursor} onZoomChange={setZoom} />
          </div>

          <div className="pointer-events-none absolute bottom-1 right-1 z-1000 flex items-center gap-3 whitespace-nowrap  border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-sm">
            <span>
              <span className="text-slate-500">Lat </span>
              {cursor ? cursor.lat.toFixed(4) : "00.0000"}
            </span>
            <span>
              <span className="text-slate-500">Lon </span>
              {cursor ? cursor.lng.toFixed(4) : "000.0000"}
            </span>
            <span>
              <span className="text-slate-500">Zoom </span>
              {zoom}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-1000 flex justify-center">
            <div className="pointer-events-auto">
              <GeospatialToolbar />
            </div>
          </div>
        </div>
      </div>

      <aside className="w-[320px] flex flex-col border-l border-slate-200 bg-white">
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <GeospatialPropertiesPanel />
        </div>
      </aside>
    </div>
  );
}
