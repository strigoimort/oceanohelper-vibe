export type BasemapId = "streets" | "dark" | "satellite" | "ocean" | "terrain";

type BasemapConfig = {
  name: string;
  url: string;
  attribution: string;
  maxZoom?: number;
  /**
   * Whether tile images can be requested with a `crossorigin` attribute.
   * Required for the map to be captured cleanly into a <canvas> (PNG
   * export). OSM's standard tile server doesn't reliably send CORS
   * headers, so "streets" is left false — exporting PNG on that basemap
   * will fail by design.
   */
  crossOrigin?: boolean;
};

export const BASEMAPS: Record<BasemapId, BasemapConfig> = {
  streets: {
    name: "Streets",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    crossOrigin: false,
  },
  dark: {
    name: "Dark",
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    maxZoom: 20,
    crossOrigin: true,
  },
  satellite: {
    name: "Satellite",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "Esri, Maxar, Earthstar Geographics",
    maxZoom: 19,
    crossOrigin: true,
  },
  ocean: {
    name: "Ocean",
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/Ocean/World_Ocean_Base/MapServer/tile/{z}/{y}/{x}",
    attribution: "Esri, GEBCO, NOAA, National Geographic, DeLorme, HERE",
    maxZoom: 16,
    crossOrigin: true,
  },
  terrain: {
    name: "Terrain",
    url: "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png",
    attribution: "&copy; OpenStreetMap contributors &copy; CARTO",
    maxZoom: 20,
    crossOrigin: true,
  },
};
