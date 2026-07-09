import {
  Circle,
  Download,
  Layers,
  MousePointer2,
  Move,
  Ruler,
  Square,
  Spline,
  Upload,
} from "lucide-react";

const tools = [
  { name: "Select", icon: MousePointer2 },
  { name: "Point", icon: Move },
  { name: "Polyline", icon: Spline },
  { name: "Polygon", icon: Square },
  { name: "Rectangle", icon: Square },
  { name: "Circle", icon: Circle },
  { name: "Measure", icon: Ruler },
  { name: "Import", icon: Upload },
  { name: "Export", icon: Download },
  { name: "Layers", icon: Layers },
];

export default function GeospatialToolbar() {
  return (
    <div className="flex h-full items-center justify-center gap-2">
      <div className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-slate-100 px-3 shadow-lg">
        {tools.map((tool) => {
          const Icon = tool.icon;

          return (
            <button
              key={tool.name}
              type="button"
              title={tool.name}
              className="flex h-10 w-10 items-center justify-center rounded-2xl border border-transparent bg-white text-slate-700 transition hover:border-slate-200 hover:bg-slate-50 hover:text-slate-900 focus:outline-none focus:ring-2 focus:ring-sky-200"
            >
              <Icon size={18} />
            </button>
          );
        })}
      </div>
    </div>
  );
}
