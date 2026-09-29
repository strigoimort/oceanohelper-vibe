import { useState } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

import { LAYER_COLOR_PALETTE } from "../../../constants/drawing";
import type { DrawnLayer } from "../hooks/use-drawing-tools";
import {
  measureLeafletLayer,
  formatDistance,
  formatArea,
} from "../../../utils/geometry";

type MeasurementRow = { label: string; value: string };

function getMeasurementRows(
  layer: DrawnLayer | null,
): [MeasurementRow, MeasurementRow] {
  if (!layer) {
    return [
      { label: "", value: "Select a feature to see measurements" },
      { label: "", value: "" },
    ];
  }

  if (layer.type === "dataset") {
    return [
      { label: "Points", value: String(layer.featureCount ?? 0) },
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
  onColorChange: (id: string, color: string) => void;
  onOpacityChange: (id: string, opacity: number) => void;
};

export default function GeospatialPropertiesPanel({
  layers,
  selectedLayerId,
  onSelectLayer,
  onDeleteLayer,
  onToggleVisibility,
  onRenameLayer,
  onColorChange,
  onOpacityChange,
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
      <div className="flex min-h-0 flex-1 flex-col">
        <section className="flex flex-1 min-h-0 flex-col pb-3">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Layers ({layers.length})
          </h2>

          {layers.length === 0 ? (
            <p className="mt-1 truncate text-sm text-slate-600">
              No layers created
            </p>
          ) : (
            <div className="mt-1 flex-1 overflow-y-auto panel-scroll">
              <ul className="space-y-0.5">
                {layers.map((layer) => (
                  <li key={layer.id}>
                    <div
                      onClick={() => onSelectLayer(layer.id)}
                      className={`group flex w-full cursor-pointer items-center justify-between gap-2 rounded-md px-1.5 py-0.5 text-left text-sm transition ${
                        layer.id === selectedLayerId
                          ? "bg-accent-soft text-accent"
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
                            className="w-full rounded border border-accent/40 px-1 text-sm outline-none"
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
                        {layer.type === "dataset" && (
                          <span className="shrink-0 text-xs text-slate-400">
                            ({layer.featureCount ?? 0})
                          </span>
                        )}
                      </span>

                      <span className="flex shrink-0 items-center gap-1">
                        {editingId !== layer.id && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              startRename(layer);
                            }}
                            className="text-slate-300 opacity-0 transition hover:text-slate-700 group-hover:opacity-100"
                            title="Rename layer"
                          >
                            <Pencil size={13} />
                          </button>
                        )}
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

        <section className="shrink-0 border-t border-slate-100 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Measurements
          </h2>
          <dl className="mt-1 space-y-0.5 text-sm">
            {measurementRows
              .filter((row) => row.label || row.value)
              .map((row, index) =>
                row.label ? (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <dt className="text-slate-600">{row.label}</dt>
                    <dd className="font-medium text-slate-900">{row.value}</dd>
                  </div>
                ) : (
                  <p key={index} className="text-slate-600">
                    {row.value}
                  </p>
                ),
              )}
          </dl>
        </section>

        <section className="shrink-0 border-t border-slate-100 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Selected object
          </h2>

          {!selectedLayer ? (
            <p className="mt-1 text-sm text-slate-600">None selected</p>
          ) : (
            <div className="mt-1 space-y-3">
              <dl className="space-y-1 text-sm">
                <div className="flex items-center justify-between">
                  <dt className="text-slate-600">Name</dt>
                  <dd className="max-w-[60%] truncate text-right font-medium text-slate-900">
                    {selectedLayer.name}
                  </dd>
                </div>

                <div className="flex items-center justify-between">
                  <dt className="text-slate-600">Type</dt>
                  <dd className="font-medium capitalize text-slate-900">
                    {selectedLayer.type}
                  </dd>
                </div>
              </dl>

              <div>
                <p className="text-xs font-medium text-slate-500">Color</p>
                <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
                  {LAYER_COLOR_PALETTE.map((color) => (
                    <button
                      key={color}
                      type="button"
                      title={color}
                      onClick={() => onColorChange(selectedLayer.id, color)}
                      className={`h-6 w-6 rounded-full border-2 transition ${
                        selectedLayer.color.toLowerCase() ===
                        color.toLowerCase()
                          ? "border-slate-900"
                          : "border-transparent"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                  <input
                    type="color"
                    value={selectedLayer.color}
                    onChange={(e) =>
                      onColorChange(selectedLayer.id, e.target.value)
                    }
                    title="Custom color"
                    className="h-6 w-6 cursor-pointer rounded-full border border-slate-200 bg-transparent p-0"
                  />
                </div>
              </div>

              <label className="block text-xs font-medium text-slate-500">
                Opacity ({Math.round(selectedLayer.opacity * 100)}%)
                <input
                  type="range"
                  min={0.1}
                  max={1}
                  step={0.05}
                  value={selectedLayer.opacity}
                  onChange={(e) =>
                    onOpacityChange(selectedLayer.id, Number(e.target.value))
                  }
                  className="mt-1.5 h-1.5 w-full accent-accent"
                />
              </label>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
