import {
  Circle,
  Download,
  Hexagon,
  MapPin,
  MousePointer2,
  RectangleHorizontal,
  Ruler,
  Spline,
  Upload,
  Image as ImageIcon,
} from "lucide-react";

import type { DrawingToolType } from "../hooks/use-drawing-tools";
import type { BasemapId } from "../../../constants/basemaps";
import GeospatialBasemapSwitcher from "./geospatial-basemap-switcher";

const drawingTools: {
  id: DrawingToolType;
  name: string;
  icon: typeof MousePointer2;
}[] = [
  { id: "select", name: "Select", icon: MousePointer2 },
  { id: "point", name: "Point", icon: MapPin },
  { id: "polyline", name: "Polyline", icon: Spline },
  { id: "polygon", name: "Polygon", icon: Hexagon },
  { id: "rectangle", name: "Rectangle", icon: RectangleHorizontal },
  { id: "circle", name: "Circle", icon: Circle },
  { id: "measure", name: "Measure", icon: Ruler },
];

type GeospatialToolbarProps = {
  activeTool: DrawingToolType;
  onToolChange: (tool: DrawingToolType) => void;
  onImportClick: () => void;
  onExportGeoJson: () => void;
  hasLayers: boolean;
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
};

export default function GeospatialToolbar({
  activeTool,
  onToolChange,
  onImportClick,
  onExportGeoJson,
  hasLayers,
  basemap,
  onBasemapChange,
}: GeospatialToolbarProps) {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <div className="flex h-12 items-center justify-center gap-1 rounded-2xl bg-slate-100 px-3 shadow-lg">
        {/* Draw group */}
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Drawing tools"
        >
          {drawingTools.map((tool) => {
            const Icon = tool.icon;
            const isActive = tool.id === activeTool;

            return (
              <button
                key={tool.id}
                type="button"
                title={tool.name}
                onClick={() => onToolChange(tool.id)}
                className={`flex h-10 w-10 items-center justify-center rounded-2xl border transition focus:outline-none focus:ring-2 focus:ring-sky-200 ${
                  isActive
                    ? "border-sky-200 bg-sky-100 text-sky-700"
                    : "border-transparent bg-white text-slate-700 hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
                }`}
              >
                <Icon size={18} />
              </button>
            );
          })}
        </div>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        {/* Data group: import/export */}
        <div
          className="flex items-center gap-1"
          role="group"
          aria-label="Import and export"
        >
          <button
            type="button"
            title="Import dataset (CSV / Shapefile)"
            onClick={onImportClick}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-white text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
          >
            <Upload size={18} />
          </button>

          <button
            type="button"
            title="Export layers as GeoJSON"
            disabled={!hasLayers}
            onClick={onExportGeoJson}
            className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-white text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={18} />
          </button>

          <button
            type="button"
            title="Export as PNG — Coming soon"
            disabled
            className="flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-2xl border border-transparent bg-white text-slate-300"
          >
            <ImageIcon size={18} />
          </button>
        </div>

        <span className="mx-1 h-6 w-px bg-slate-200" />

        {/* View group: basemap */}
        <div role="group" aria-label="Basemap">
          <GeospatialBasemapSwitcher
            value={basemap}
            onChange={onBasemapChange}
          />
        </div>
      </div>
    </div>
  );
}
