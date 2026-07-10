import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import { BASEMAPS, type BasemapId } from "../../../constants/basemaps";

const INITIAL_CENTER: [number, number] = [-2.5, 118];
const INITIAL_ZOOM = 5;

type CursorPosition = { lat: number; lng: number };

type GeospatialMapProps = {
  onCursorMove?: (position: CursorPosition | null) => void;
  onZoomChange?: (zoom: number) => void;
  onMapReady?: (map: L.Map) => void;
  basemap?: BasemapId;
};

export default function GeospatialMap({
  onCursorMove,
  onZoomChange,
  onMapReady,
  basemap = "streets",
}: GeospatialMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const attributionControlRef = useRef<L.Control.Attribution | null>(null);
  const currentAttributionRef = useRef<string | null>(null);

  const onCursorMoveRef = useRef(onCursorMove);
  const onZoomChangeRef = useRef(onZoomChange);
  const onMapReadyRef = useRef(onMapReady);

  useEffect(() => {
    onCursorMoveRef.current = onCursorMove;
  }, [onCursorMove]);

  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

  useEffect(() => {
    onMapReadyRef.current = onMapReady;
  }, [onMapReady]);

  // Map initialization (runs once).
  useEffect(() => {
    if (!mapRef.current || leafletRef.current) {
      return undefined;
    }

    const map = L.map(mapRef.current, {
      center: INITIAL_CENTER,
      zoom: INITIAL_ZOOM,
      zoomControl: true,
      attributionControl: false,
    });

    // Attribution text is now populated dynamically per-basemap (see the
    // basemap-swap effect below), so it starts empty here.
    attributionControlRef.current = L.control
      .attribution({ position: "topright", prefix: false })
      .addTo(map);

    L.control.scale({ position: "bottomleft" }).addTo(map);

    const handleMouseMove = (event: L.LeafletMouseEvent) => {
      onCursorMoveRef.current?.({
        lat: event.latlng.lat,
        lng: event.latlng.lng,
      });
    };

    const handleMouseOut = () => {
      onCursorMoveRef.current?.(null);
    };

    const handleZoomEnd = () => {
      onZoomChangeRef.current?.(map.getZoom());
    };

    map.on("mousemove", handleMouseMove);
    map.on("mouseout", handleMouseOut);
    map.on("zoomend", handleZoomEnd);

    onZoomChangeRef.current?.(map.getZoom());

    leafletRef.current = map;
    onMapReadyRef.current?.(map);

    const handleResize = () => {
      map.invalidateSize();
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      map.off("mousemove", handleMouseMove);
      map.off("mouseout", handleMouseOut);
      map.off("zoomend", handleZoomEnd);
      map.remove();
      leafletRef.current = null;
    };
  }, []);

  // Swap the active tile layer whenever the selected basemap changes.
  useEffect(() => {
    const map = leafletRef.current;
    if (!map) return undefined;

    const config = BASEMAPS[basemap];

    if (baseLayerRef.current) {
      map.removeLayer(baseLayerRef.current);
    }

    const layer = L.tileLayer(config.url, {
      maxZoom: config.maxZoom ?? 19,
      attribution: "",
      crossOrigin: config.crossOrigin ?? false,
    });
    layer.addTo(map);
    layer.bringToBack();
    baseLayerRef.current = layer;

    if (currentAttributionRef.current) {
      attributionControlRef.current?.removeAttribution(
        currentAttributionRef.current,
      );
    }
    attributionControlRef.current?.addAttribution(config.attribution);
    currentAttributionRef.current = config.attribution;

    return undefined;
  }, [basemap]);

  return <div ref={mapRef} className="h-full w-full bg-slate-100" />;
}
