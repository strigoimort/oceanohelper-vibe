import { useState } from "react";
import { Eye, EyeOff, Trash2 } from "lucide-react";

import type { DrawnLayer } from "../hooks/use-drawing-tools";
import {
  measureLeafletLayer,
  formatDistance,
  formatArea,
} from "../../../utils/geometry";

type MeasurementRow = { label: string; value: string };

// Always returns exactly 2 rows, regardless of the selected geometry type,
// so the Measurements block never changes height.
function getMeasurementRows(
  layer: DrawnLayer | null,
): [MeasurementRow, MeasurementRow] {
  if (!layer) {
    return [
      { label: "", value: "Select a feature to see measurements" },
      { label: "", value: "" },
    ];
  }

  const measurement = measureLeafletLayer(layer.leafletLayer);

  switch (layer.type) {
    case "point":
      return [
        {
          label: "Latitude",
          value:
            measurement.lat !== undefined ? measurement.lat.toFixed(4) : "—",
        },
        {
          label: "Longitude",
          value:
            measurement.lng !== undefined ? measurement.lng.toFixed(4) : "—",
        },
      ];
    case "polyline":
    case "measure":
      return [
        {
          label: "Distance",
          value:
            measurement.distance !== undefined
              ? formatDistance(measurement.distance)
              : "—",
        },
        { label: "", value: "" },
      ];
    case "circle":
      return [
        {
          label: "Radius",
          value:
            measurement.radius !== undefined
              ? formatDistance(measurement.radius)
              : "—",
        },
        {
          label: "Area",
          value:
            measurement.area !== undefined ? formatArea(measurement.area) : "—",
        },
      ];
    case "polygon":
    case "rectangle":
      return [
        {
          label: "Area",
          value:
            measurement.area !== undefined ? formatArea(measurement.area) : "—",
        },
        {
          label: "Perimeter",
          value:
            measurement.perimeter !== undefined
              ? formatDistance(measurement.perimeter)
              : "—",
        },
      ];
    default:
      return [
        { label: "", value: "—" },
        { label: "", value: "" },
      ];
  }
}

type GeospatialPropertiesPanelProps = {
  layers: DrawnLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string) => void;
  onDeleteLayer: (id: string) => void;
  onToggleVisibility: (id: string) => void;
  onRenameLayer: (id: string, name: string) => void;
};

export default function GeospatialPropertiesPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onDeleteLayer,
  onToggleVisibility,
  onRenameLayer,
}: GeospatialPropertiesPanelProps) {
  const selectedLayer = layers.find((l) => l.id === selectedLayerId) ?? null;
  const measurementRows = getMeasurementRows(selectedLayer);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState("");

  const startRename = (layer: DrawnLayer) => {
    setEditingId(layer.id);
    setDraftName(layer.name);
  };

  const commitRename = (id: string) => {
    if (draftName.trim()) onRenameLayer(id, draftName.trim());
    setEditingId(null);
  };

  return (
    <div className="flex h-full min-h-0 flex-col">
      <div className="shrink-0 border-b border-slate-100 pb-3">
        <h1 className="text-lg font-semibold text-slate-900">
          Workspace details
        </h1>
      </div>

      {/* Scrolls as a whole only if total content exceeds panel height. */}
      <div className="flex min-h-0 flex-1 flex-col">
        {/* Sized to its own content (up to max-h-64), not stretched to
            fill leftover space — this is what caused the huge empty gap. */}
        <section className="flex flex-1 min-h-0 flex-col py-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Layers ({layers.length})
          </h2>

          {layers.length === 0 ? (
            <p className="mt-1 truncate text-sm text-slate-700">
              No layers created
            </p>
          ) : (
            <div className="mt-1 flex-1 overflow-y-auto">
              <ul className="space-y-0.5">
                {layers.map((layer) => (
                  <li key={layer.id}>
                    <div
                      onClick={() => onSelectLayer(layer.id)}
                      className={`flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-1.5 py-1 text-left text-sm transition ${
                        layer.id === selectedLayerId
                          ? "bg-sky-50 text-sky-700"
                          : "text-slate-700 hover:bg-slate-50"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2">
                        <span
                          className="h-2 w-2 shrink-0 rounded-full"
                          style={{ backgroundColor: layer.color }}
                        />
                        {editingId === layer.id ? (
                          <input
                            autoFocus
                            value={draftName}
                            onChange={(e) => setDraftName(e.target.value)}
                            onBlur={() => commitRename(layer.id)}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") commitRename(layer.id);
                              if (e.key === "Escape") setEditingId(null);
                            }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full rounded border border-sky-300 px-1 text-sm outline-none"
                          />
                        ) : (
                          <span
                            className="truncate"
                            onDoubleClick={(e) => {
                              e.stopPropagation();
                              startRename(layer);
                            }}
                          >
                            {layer.name}
                          </span>
                        )}
                      </span>

                      <span className="flex shrink-0 items-center gap-1">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onToggleVisibility(layer.id);
                          }}
                          className="text-slate-400 hover:text-slate-700"
                          title={layer.visible ? "Hide layer" : "Show layer"}
                        >
                          {layer.visible ? (
                            <Eye size={14} />
                          ) : (
                            <EyeOff size={14} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onDeleteLayer(layer.id);
                          }}
                          className="text-slate-400 hover:text-red-500"
                          title="Delete layer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <section className="h-19 shrink-0 border-t border-slate-100 pt-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Measurements
          </h2>
          <div className="mt-1 space-y-0.5">
            {measurementRows.map((row, index) => (
              <p key={index} className="h-5 truncate text-sm text-slate-700">
                {row.label ? `${row.label} — ${row.value}` : row.value}
              </p>
            ))}
          </div>
        </section>

        <section className="h-16 shrink-0 border-t border-slate-100 pt-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Selected object
          </h2>
          <p className="mt-1 h-5 truncate text-sm text-slate-700">
            {selectedLayer ? selectedLayer.name : "None selected"}
          </p>
          <p className="h-4 truncate text-xs text-slate-400">
            {selectedLayer ? `Type — ${selectedLayer.type}` : ""}
          </p>
        </section>
      </div>
    </div>
  );
}
