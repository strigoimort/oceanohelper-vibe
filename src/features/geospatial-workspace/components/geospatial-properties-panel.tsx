import { useState } from "react";
import { Eye, EyeOff, Pencil, Trash2 } from "lucide-react";

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

        <section className="h-20 shrink-0">
          <h2 className="text-[11px] border-t pt-2 border-slate-100 font-semibold uppercase tracking-wide text-slate-400">
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

        <section className="shrink-0 h-17 border-t border-slate-100 pt-2">
          <h2 className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">
            Selected object
          </h2>

          {!selectedLayer ? (
            <p className="mt-1 text-sm text-slate-600">None selected</p>
          ) : (
            <dl className="mt-1 space-y-1 text-sm">
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
          )}
        </section>
      </div>
    </div>
  );
}
