/**
 * A single observed position of a particle, enriched with a derived
 * epoch timestamp so it can be compared and sorted numerically.
 */
export type ParticlePoint = {
  lat: number;
  lng: number;
  timestamp: string;
  time: number;
  speed?: number;
  direction?: number;
};

/** The full set of observations for one particle, ordered chronologically. */
export type ParticleTrajectory = {
  particleId: string;
  points: ParticlePoint[];
};

/** One imported file, rendered as an independent, styleable map layer. */
export type ParticleDataset = {
  id: string;
  name: string;
  color: string;
  visible: boolean;
  trajectories: ParticleTrajectory[];
};

/** A single row parsed from an imported CSV file, before grouping. */
export type RawParticleRecord = {
  particleId: string;
  lat: number;
  lng: number;
  timestamp: string;
  speed?: number;
  direction?: number;
};
