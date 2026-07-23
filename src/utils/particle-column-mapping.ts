function normalizeHeader(header: string): string {
  return header.trim().toLowerCase();
}

function tokenize(value: string): string[] {
  return normalizeHeader(value)
    .split(/[^a-z0-9]+/)
    .filter(Boolean);
}

function findColumn(
  headers: string[],
  synonyms: string[],
  usedHeaders: Set<string>,
): string | null {
  const candidates = headers
    .filter((h) => !usedHeaders.has(h))
    .map((h) => ({ header: h, tokens: tokenize(h) }));

  // Pass 1: exact match, ignoring separators (e.g. "particle_id" === "particleid").
  for (const synonym of synonyms) {
    const synonymJoined = tokenize(synonym).join("");
    const match = candidates.find((c) => c.tokens.join("") === synonymJoined);
    if (match) return match.header;
  }

  // Pass 2: token-level match (e.g. header "buoy_id" contains the token "buoy").
  for (const synonym of synonyms) {
    const synonymTokens = tokenize(synonym);
    const match = candidates.find((c) =>
      synonymTokens.every((token) => c.tokens.includes(token)),
    );
    if (match) return match.header;
  }

  return null;
}

// Ordered from most specific to most generic — specific synonyms are
// matched first so a generic token like "id" only wins as a last resort.
const PARTICLE_ID_SYNONYMS = [
  "particle_id",
  "buoy_id",
  "drifter_id",
  "station_id",
  "object_id",
  "tag_id",
  "buoy",
  "drifter",
  "station",
  "name",
  "label",
  "id",
];
const LAT_SYNONYMS = ["latitude", "lat", "y"];
const LNG_SYNONYMS = ["longitude", "lng", "lon", "long", "x"];
const TIMESTAMP_SYNONYMS = [
  "timestamp",
  "date_time",
  "datetime",
  "observed_at",
  "recorded_at",
  "obs_time",
  "record_time",
  "time",
  "date",
];
const SPEED_SYNONYMS = ["speed", "velocity", "spd"];
const DIRECTION_SYNONYMS = ["direction", "bearing", "heading", "dir"];

export type ParticleColumnMapping = {
  particleId: string | null;
  lat: string | null;
  lng: string | null;
  timestamp: string | null;
  speed: string | null;
  direction: string | null;
};

export function detectParticleColumnMapping(
  headers: string[],
): ParticleColumnMapping {
  const used = new Set<string>();

  const particleId = findColumn(headers, PARTICLE_ID_SYNONYMS, used);
  if (particleId) used.add(particleId);

  const lat = findColumn(headers, LAT_SYNONYMS, used);
  if (lat) used.add(lat);

  const lng = findColumn(headers, LNG_SYNONYMS, used);
  if (lng) used.add(lng);

  const timestamp = findColumn(headers, TIMESTAMP_SYNONYMS, used);
  if (timestamp) used.add(timestamp);

  const speed = findColumn(headers, SPEED_SYNONYMS, used);
  if (speed) used.add(speed);

  const direction = findColumn(headers, DIRECTION_SYNONYMS, used);
  if (direction) used.add(direction);

  return { particleId, lat, lng, timestamp, speed, direction };
}
