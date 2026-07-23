import type {
  ParticleDataset,
  ParticlePoint,
  ParticleTrajectory,
  RawParticleRecord,
} from "../types/particle";

const EARTH_RADIUS = 6378137; // meters

function toRadians(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

/** Great-circle distance between two coordinates, in meters. */
export function haversineDistance(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const dLat = toRadians(b.lat - a.lat);
  const dLng = toRadians(b.lng - a.lng);
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);
  const h =
    sinDLat * sinDLat + Math.cos(lat1) * Math.cos(lat2) * sinDLng * sinDLng;

  return 2 * EARTH_RADIUS * Math.asin(Math.sqrt(h));
}

/** Initial bearing from point a to point b, in degrees (0-360). */
export function calculateBearing(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const lat1 = toRadians(a.lat);
  const lat2 = toRadians(b.lat);
  const dLng = toRadians(b.lng - a.lng);

  const y = Math.sin(dLng) * Math.cos(lat2);
  const x =
    Math.cos(lat1) * Math.sin(lat2) -
    Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);

  return ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
}

/** Projects a destination coordinate given a starting point, bearing, and distance. */
export function destinationPoint(
  origin: { lat: number; lng: number },
  bearingDeg: number,
  distanceMeters: number,
): { lat: number; lng: number } {
  const angularDistance = distanceMeters / EARTH_RADIUS;
  const bearing = toRadians(bearingDeg);
  const lat1 = toRadians(origin.lat);
  const lng1 = toRadians(origin.lng);

  const lat2 = Math.asin(
    Math.sin(lat1) * Math.cos(angularDistance) +
      Math.cos(lat1) * Math.sin(angularDistance) * Math.cos(bearing),
  );
  const lng2 =
    lng1 +
    Math.atan2(
      Math.sin(bearing) * Math.sin(angularDistance) * Math.cos(lat1),
      Math.cos(angularDistance) - Math.sin(lat1) * Math.sin(lat2),
    );

  return {
    lat: (lat2 * 180) / Math.PI,
    lng: (((lng2 * 180) / Math.PI + 540) % 360) - 180,
  };
}

export type ForecastOptions = {
  durationHours: number;
  intervalHours: number;
};

/**
 * Projects a particle's future positions using dead-reckoning: the last
 * known speed and direction are held constant for the requested duration.
 * Returns an empty array when the particle has no known speed/direction to
 * project from, or when the settings are invalid — never throws.
 */
export function computeForecastPoints(
  trajectory: ParticleTrajectory,
  options: ForecastOptions,
): ParticlePoint[] {
  const last = trajectory.points[trajectory.points.length - 1];
  if (!last || last.speed === undefined || last.direction === undefined) {
    return [];
  }
  if (options.durationHours <= 0 || options.intervalHours <= 0) return [];
  if (last.speed <= 0) return [];

  const steps = Math.floor(options.durationHours / options.intervalHours);
  const distancePerStep = last.speed * options.intervalHours * 3600;

  const points: ParticlePoint[] = [];
  let current: { lat: number; lng: number } = { lat: last.lat, lng: last.lng };
  let time = last.time;

  for (let i = 1; i <= steps; i++) {
    current = destinationPoint(current, last.direction, distancePerStep);
    time += options.intervalHours * 3600 * 1000;
    points.push({
      lat: current.lat,
      lng: current.lng,
      timestamp: new Date(time).toISOString(),
      time,
      speed: last.speed,
      direction: last.direction,
    });
  }

  return points;
}

// Browsers decode unrecognized byte sequences (e.g. a Latin-1 non-breaking
// space between date and time, common in Excel-exported CSVs saved with a
// legacy encoding) as the Unicode replacement character. Both are treated
// as plain whitespace so they don't silently break date parsing below.
const WHITESPACE_ARTIFACT_PATTERN = /[\u00A0\uFEFF\uFFFD]/g;

// Matches common non-ISO date/time formats, e.g.:
//   "06/07/2026 12:30"        (24-hour)
//   "2025-01-01 06:00 pm"     (12-hour with am/pm)
// Group 1/3 tells us which side has the 4-digit year; groups 4-6 are the
// time; group 7 is an optional am/pm marker.
const DATE_TIME_PATTERN =
  /^(\d{1,4})[/\-.](\d{1,2})[/\-.](\d{1,4})(?:[\sT]+(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(am|pm)?)?/i;

/**
 * Parses a timestamp string into epoch milliseconds. Falls back to a
 * manual parser for common non-ISO formats (including 12-hour am/pm
 * clocks) that the native Date constructor can't reliably handle across
 * browsers.
 */
export function parseTimestamp(value: string): number {
  const cleaned = value.replace(WHITESPACE_ARTIFACT_PATTERN, " ").trim();

  const isoAttempt = new Date(cleaned).getTime();
  if (!Number.isNaN(isoAttempt)) return isoAttempt;

  const match = cleaned.match(DATE_TIME_PATTERN);
  if (!match) return NaN;

  const [
    ,
    first,
    monthOrSecond,
    third,
    hourStr,
    minuteStr,
    secondStr,
    meridiem,
  ] = match;

  let year: number;
  let month: number;
  let day: number;

  if (first.length === 4) {
    // YYYY/MM/DD
    year = Number(first);
    month = Number(monthOrSecond);
    day = Number(third);
  } else if (third.length === 4) {
    // DD/MM/YYYY — assumed day-first, the common convention for ID/AU/EU data.
    day = Number(first);
    month = Number(monthOrSecond);
    year = Number(third);
  } else {
    return NaN;
  }

  let hour = hourStr ? Number(hourStr) : 0;
  const minute = minuteStr ? Number(minuteStr) : 0;
  const second = secondStr ? Number(secondStr) : 0;

  if (meridiem) {
    const isPM = meridiem.toLowerCase() === "pm";
    if (isPM && hour < 12) hour += 12;
    if (!isPM && hour === 12) hour = 0;
  }

  return Date.UTC(year, month - 1, day, hour, minute, second);
}

export function buildTrajectories(
  records: RawParticleRecord[],
): ParticleTrajectory[] {
  const grouped = new Map<string, RawParticleRecord[]>();

  records.forEach((record) => {
    const list = grouped.get(record.particleId) ?? [];
    list.push(record);
    grouped.set(record.particleId, list);
  });

  const trajectories: ParticleTrajectory[] = [];

  grouped.forEach((rawPoints, particleId) => {
    const sorted = [...rawPoints].sort(
      (a, b) => parseTimestamp(a.timestamp) - parseTimestamp(b.timestamp),
    );

    const points: ParticlePoint[] = sorted.map((record, index) => {
      const time = parseTimestamp(record.timestamp);
      const previous = index > 0 ? sorted[index - 1] : null;

      let speed = record.speed;
      let direction = record.direction;

      if (previous) {
        const previousTime = parseTimestamp(previous.timestamp);
        const distance = haversineDistance(previous, record);
        const elapsedSeconds = (time - previousTime) / 1000;

        if (speed === undefined && elapsedSeconds > 0) {
          speed = distance / elapsedSeconds;
        }
        if (direction === undefined) {
          direction = calculateBearing(previous, record);
        }
      }

      return {
        lat: record.lat,
        lng: record.lng,
        timestamp: record.timestamp,
        time,
        speed,
        direction,
      };
    });

    trajectories.push({ particleId, points });
  });

  return trajectories;
}

/** Merges and sorts the unique timestamps found across all visible datasets. */
export function getTimelineTimestamps(datasets: ParticleDataset[]): number[] {
  const times = new Set<number>();

  datasets
    .filter((dataset) => dataset.visible)
    .forEach((dataset) =>
      dataset.trajectories.forEach((trajectory) =>
        trajectory.points.forEach((point) => times.add(point.time)),
      ),
    );

  return Array.from(times).sort((a, b) => a - b);
}

/** Returns the trajectory points observed at or before the given time. */
export function getPointsUpTo(
  trajectory: ParticleTrajectory,
  timeMs: number,
): ParticlePoint[] {
  return trajectory.points.filter((point) => point.time <= timeMs);
}

/** Returns the most recent known position of a particle at the given time. */
export function getCurrentPoint(
  trajectory: ParticleTrajectory,
  timeMs: number,
): ParticlePoint | null {
  const points = getPointsUpTo(trajectory, timeMs);
  return points.length > 0 ? points[points.length - 1] : null;
}

/** Total distance traveled by a particle up to the given time, in meters. */
export function getDistanceTraveled(
  trajectory: ParticleTrajectory,
  timeMs: number,
): number {
  const points = getPointsUpTo(trajectory, timeMs);
  let total = 0;
  for (let i = 1; i < points.length; i++) {
    total += haversineDistance(points[i - 1], points[i]);
  }
  return total;
}

export function formatSpeed(metersPerSecond: number): string {
  return `${metersPerSecond.toFixed(2)} m/s`;
}

export function formatDirection(degrees: number): string {
  return `${degrees.toFixed(0)}°`;
}

export function formatDistance(meters: number): string {
  if (meters >= 1000) return `${(meters / 1000).toFixed(2)} km`;
  return `${meters.toFixed(0)} m`;
}

export function formatElapsed(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  if (hours > 0) return `${hours}h ${minutes}m`;
  if (minutes > 0) return `${minutes}m`;
  return `${Math.max(0, Math.floor(seconds))}s`;
}

export type ParticleTracerStatistics = {
  totalParticles: number;
  activeParticles: number;
  totalDistance: number;
  averageSpeed: number;
  maxSpeed: number;
};

/** Aggregates fleet-wide statistics across visible datasets at the given time. */
export function computeStatistics(
  datasets: ParticleDataset[],
  timeMs: number,
): ParticleTracerStatistics {
  const visibleTrajectories = datasets
    .filter((dataset) => dataset.visible)
    .flatMap((dataset) => dataset.trajectories);

  let totalDistance = 0;
  let activeParticles = 0;
  let speedSum = 0;
  let speedCount = 0;
  let maxSpeed = 0;

  visibleTrajectories.forEach((trajectory) => {
    if (trajectory.points.length === 0) return;

    totalDistance += getDistanceTraveled(trajectory, timeMs);

    const current = getCurrentPoint(trajectory, timeMs);
    const last = trajectory.points[trajectory.points.length - 1];

    if (current) {
      if (current.time < last.time) activeParticles += 1;

      if (current.speed !== undefined) {
        speedSum += current.speed;
        speedCount += 1;
        maxSpeed = Math.max(maxSpeed, current.speed);
      }
    }
  });

  return {
    totalParticles: visibleTrajectories.length,
    activeParticles,
    totalDistance,
    averageSpeed: speedCount > 0 ? speedSum / speedCount : 0,
    maxSpeed,
  };
}
