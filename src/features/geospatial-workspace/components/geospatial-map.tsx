import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const INITIAL_CENTER: [number, number] = [-2.5, 118];
const INITIAL_ZOOM = 5;

type CursorPosition = { lat: number; lng: number };

type GeospatialMapProps = {
  onCursorMove?: (position: CursorPosition | null) => void;
  onZoomChange?: (zoom: number) => void;
};

export default function GeospatialMap({
  onCursorMove,
  onZoomChange,
}: GeospatialMapProps) {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletRef = useRef<L.Map | null>(null);

  // Keep the latest callbacks in refs so the map-init effect below can stay
  // dependency-free — otherwise a new inline callback from the parent on
  // every render would tear down and recreate the whole Leaflet instance.
  const onCursorMoveRef = useRef(onCursorMove);
  const onZoomChangeRef = useRef(onZoomChange);

  useEffect(() => {
    onCursorMoveRef.current = onCursorMove;
  }, [onCursorMove]);

  useEffect(() => {
    onZoomChangeRef.current = onZoomChange;
  }, [onZoomChange]);

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

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: "",
    }).addTo(map);

    // Default attribution position (bottom-right) would collide with our
    // custom coordinate readout in the same corner, so it's placed manually.
    L.control
      .attribution({ position: "topright", prefix: false })
      .addAttribution(
        '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      )
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

  return <div ref={mapRef} className="h-full w-full bg-slate-100" />;
}
