import { Eye, EyeOff, Trash2 } from "lucide-react";

import type { ParticleDataset } from "../../../types/particle";

type ParticleLayerPanelProps = {
  datasets: ParticleDataset[];
  onToggleVisibility: (id: string) => void;
  onRemoveDataset: (id: string) => void;
};

export default function ParticleLayerPanel({
  datasets,
  onToggleVisibility,
  onRemoveDataset,
}: ParticleLayerPanelProps) {
  return (
    <section>
      <h2 className="micro-label">Datasets ({datasets.length})</h2>

      {datasets.length === 0 ? (
        <p className="mt-1 body-text">No dataset imported</p>
      ) : (
        <ul className="mt-2 space-y-1">
          {datasets.map((dataset) => (
            <li
              key={dataset.id}
              className="flex items-center justify-between gap-2 rounded-md px-1.5 py-0.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: dataset.color }}
                />
                <span className="truncate">{dataset.name}</span>
                <span className="shrink-0 text-xs text-slate-400">
                  ({dataset.trajectories.length})
                </span>
              </span>

              <span className="flex shrink-0 items-center gap-1">
                <button
                  type="button"
                  onClick={() => onToggleVisibility(dataset.id)}
                  className="text-slate-400 hover:text-slate-700"
                  title={dataset.visible ? "Hide dataset" : "Show dataset"}
                >
                  {dataset.visible ? <Eye size={14} /> : <EyeOff size={14} />}
                </button>
                <button
                  type="button"
                  onClick={() => onRemoveDataset(dataset.id)}
                  className="text-slate-400 hover:text-red-500"
                  title="Remove dataset"
                >
                  <Trash2 size={14} />
                </button>
              </span>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
