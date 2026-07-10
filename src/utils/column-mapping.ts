const LAT_SYNONYMS = ["latitude", "lat", "y"];
const LNG_SYNONYMS = ["longitude", "lng", "lon", "long", "x"];
const NAME_SYNONYMS = ["name", "station", "label", "id"];

function findColumn(headers: string[], synonyms: string[]): string | null {
  const normalized = headers.map((h) => h.trim().toLowerCase());
  for (const synonym of synonyms) {
    const index = normalized.indexOf(synonym);
    if (index !== -1) return headers[index];
  }
  return null;
}

export type ColumnMapping = {
  lat: string | null;
  lng: string | null;
  name: string | null;
};

export function detectColumnMapping(headers: string[]): ColumnMapping {
  return {
    lat: findColumn(headers, LAT_SYNONYMS),
    lng: findColumn(headers, LNG_SYNONYMS),
    name: findColumn(headers, NAME_SYNONYMS),
  };
}
