import {
  Circle,
  Hexagon,
  MapPin,
  MousePointer2,
  RectangleHorizontal,
  Ruler,
  Spline,
  Upload,
} from "lucide-react";

import type { DrawingToolType } from "../hooks/use-drawing-tools";
import type { BasemapId } from "../../../constants/basemap";
import GeospatialBasemapSwitcher from "./geospatial-basemap-switcher";
import GeospatialExportMenu from "./geospatial-export-menu";

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
  onExportPng: () => void;
  hasLayers: boolean;
  basemap: BasemapId;
  onBasemapChange: (id: BasemapId) => void;
};

export default function GeospatialToolbar({
  activeTool,
  onToolChange,
  onImportClick,
  onExportGeoJson,
  onExportPng,
  hasLayers,
  basemap,
  onBasemapChange,
}: GeospatialToolbarProps) {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <div className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 shadow-lg">
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

        <span className="mx-1 h-6 w-px bg-slate-200" />

        <button
          type="button"
          title="Import dataset"
          onClick={onImportClick}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-white text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900"
        >
          <Upload size={18} />
        </button>

        <GeospatialExportMenu
          disabled={!hasLayers}
          onExportGeoJson={onExportGeoJson}
          onExportPng={onExportPng}
        />

        <GeospatialBasemapSwitcher value={basemap} onChange={onBasemapChange} />
      </div>
    </div>
  );
}
