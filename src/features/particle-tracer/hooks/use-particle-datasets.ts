import { useCallback, useState } from "react";

import { PARTICLE_COLOR_PALETTE } from "../../../constants/particle-tracer";
import type {
  ParticleDataset,
  ParticleTrajectory,
} from "../../../types/particle";

let datasetCounter = 0;
const nextDatasetId = () =>
  `particle-dataset-${Date.now()}-${datasetCounter++}`;

export type ParticleSelection = { datasetId: string; particleId: string };

/** Owns the collection of imported trajectory datasets and their layer state. */
export function useParticleDatasets() {
  const [datasets, setDatasets] = useState<ParticleDataset[]>([]);
  const [selectedParticle, setSelectedParticle] =
    useState<ParticleSelection | null>(null);

  const addDataset = useCallback(
    (name: string, trajectories: ParticleTrajectory[]) => {
      const id = nextDatasetId();
      setDatasets((prev) => [
        ...prev,
        {
          id,
          name,
          color:
            PARTICLE_COLOR_PALETTE[prev.length % PARTICLE_COLOR_PALETTE.length],
          visible: true,
          trajectories,
        },
      ]);
      return id;
    },
    [],
  );

  const removeDataset = useCallback((id: string) => {
    setDatasets((prev) => prev.filter((d) => d.id !== id));
    setSelectedParticle((current) =>
      current?.datasetId === id ? null : current,
    );
  }, []);

  const toggleDatasetVisibility = useCallback((id: string) => {
    setDatasets((prev) =>
      prev.map((d) => (d.id === id ? { ...d, visible: !d.visible } : d)),
    );
  }, []);

  const renameDataset = useCallback((id: string, name: string) => {
    setDatasets((prev) => prev.map((d) => (d.id === id ? { ...d, name } : d)));
  }, []);

  const clearAllDatasets = useCallback(() => {
    setDatasets([]);
    setSelectedParticle(null);
  }, []);

  return {
    datasets,
    addDataset,
    removeDataset,
    toggleDatasetVisibility,
    renameDataset,
    clearAllDatasets,
    selectedParticle,
    setSelectedParticle,
  };
}
