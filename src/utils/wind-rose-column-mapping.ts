const DIRECTION_SYNONYMS = [
  "wind direction",
  "wind_direction",
  "direction",
  "dir",
  "heading",
  "wave direction",
  "wave_direction",
  "mean direction",
  "mean_direction",
];

const MAGNITUDE_SYNONYMS = [
  "wind speed",
  "wind_speed",
  "speed",
  "velocity",
  "magnitude",
  "wave height",
  "wave_height",
  "height",
  "hs",
];

const TIMESTAMP_SYNONYMS = [
  "timestamp",
  "datetime",
  "date",
  "time",
  "date time",
  "date_time",
  "observation time",
  "observation_time",
];

function findColumn(headers: string[], synonyms: string[]): string | null {
  const normalized = headers.map((header) => header.trim().toLowerCase());

  for (const synonym of synonyms) {
    const index = normalized.indexOf(synonym);
    if (index !== -1) {
      return headers[index];
    }
  }

  return null;
}

export type WindRoseColumnMapping = {
  direction: string | null;
  magnitude: string | null;
  timestamp: string | null;
};

export function detectWindRoseColumnMapping(
  headers: string[],
): WindRoseColumnMapping {
  return {
    direction: findColumn(headers, DIRECTION_SYNONYMS),
    magnitude: findColumn(headers, MAGNITUDE_SYNONYMS),
    timestamp: findColumn(headers, TIMESTAMP_SYNONYMS),
  };
}
