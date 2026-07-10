import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";

import { DRAWING_STYLES } from "../../../constants/drawing";
import { calculateLineLength, formatDistance } from "../../../utils/geometry";

export type DrawingToolType =
  | "select"
  | "point"
  | "polyline"
  | "polygon"
  | "rectangle"
  | "circle"
  | "measure";

export type DrawnLayer = {
  id: string;
  type: DrawingToolType;
  name: string;
  color: string;
  visible: boolean;
  leafletLayer: L.Layer;
};

const HIGHLIGHT_COLOR = "#f59e0b";
const DOUBLE_CLICK_MS = 400;
const DOUBLE_CLICK_PIXELS = 12;

let layerCounter = 0;
const nextLayerId = () => `layer-${Date.now()}-${layerCounter++}`;

function labelForType(type: DrawingToolType) {
  switch (type) {
    case "point":
      return "Point";
    case "polyline":
      return "Polyline";
    case "polygon":
      return "Polygon";
    case "rectangle":
      return "Rectangle";
    case "circle":
      return "Circle";
    case "measure":
      return "Measurement";
    default:
      return "Feature";
  }
}

const pointIconHtml = () =>
  `<span style="display:block;width:12px;height:12px;border-radius:9999px;background:${DRAWING_STYLES.point.color};border:2px solid white;box-shadow:0 0 0 1px rgba(0,0,0,0.15);"></span>`;

/**
 * Manages the active drawing tool and the features created on the map.
 * Owns all Leaflet interaction logic so components can stay presentational.
 */
export function useDrawingTools(map: L.Map | null) {
  const [activeTool, setActiveTool] = useState<DrawingToolType>("select");
  const [layers, setLayers] = useState<DrawnLayer[]>([]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null);

  const layerGroupRef = useRef<L.LayerGroup | null>(null);
  const tempLayerRef = useRef<L.Layer | null>(null);
  const drawingPointsRef = useRef<L.LatLng[]>([]);
  // Tracks the previous click so we can detect a "finish" click manually
  // (see the click handler below) instead of relying on the native
  // `dblclick` DOM event, which is unreliable when clicks aren't fast or
  // precise enough for the browser to recognize them as a double-click.
  const lastClickRef = useRef<{ time: number; latlng: L.LatLng | null }>({
    time: 0,
    latlng: null,
  });

  useEffect(() => {
    if (!map) return undefined;

    if (!layerGroupRef.current) {
      layerGroupRef.current = L.layerGroup().addTo(map);
    }

    return () => {
      layerGroupRef.current?.remove();
      layerGroupRef.current = null;
    };
  }, [map]);

  const registerLayer = useCallback(
    (type: DrawingToolType, leafletLayer: L.Layer, customName?: string) => {
      const id = nextLayerId();
      const color = DRAWING_STYLES[type]?.color ?? DRAWING_STYLES.default.color;

      layerGroupRef.current?.addLayer(leafletLayer);
      leafletLayer.on("click", () => setSelectedLayerId(id));

      setLayers((prev) => [
        ...prev,
        {
          id,
          type,
          name:
            customName ||
            `${labelForType(type)} ${prev.filter((l) => l.type === type).length + 1}`,
          color: String(color),
          visible: true,
          leafletLayer,
        },
      ]);
      setSelectedLayerId(id);

      return id;
    },
    [],
  );

  const clearTempLayer = useCallback(() => {
    if (tempLayerRef.current) {
      layerGroupRef.current?.removeLayer(tempLayerRef.current);
      tempLayerRef.current = null;
    }
  }, []);

  const resetTempDrawing = useCallback(() => {
    clearTempLayer();
    drawingPointsRef.current = [];
    lastClickRef.current = { time: 0, latlng: null };
  }, [clearTempLayer]);

  // Renders a dashed preview line/polygon from an arbitrary set of points —
  // used both for committed clicks and for the live rubber-band segment
  // that follows the cursor before the next click.
  const renderPreview = useCallback(
    (type: "polyline" | "polygon" | "measure", points: L.LatLng[]) => {
      clearTempLayer();
      if (points.length < 2) return;

      const style: L.PathOptions = {
        ...DRAWING_STYLES[type],
        dashArray: "4 4",
      };
      const preview =
        type === "polygon"
          ? L.polygon(points, style)
          : L.polyline(points, style);

      if (type === "measure") {
        preview
          .bindTooltip(formatDistance(calculateLineLength(points)), {
            permanent: true,
            direction: "right",
          })
          .openTooltip(points[points.length - 1]);
      }

      tempLayerRef.current = preview;
      layerGroupRef.current?.addLayer(preview);
    },
    [clearTempLayer],
  );

  const finishPolyshape = useCallback(
    (type: "polyline" | "polygon" | "measure") => {
      const points = drawingPointsRef.current;

      if (points.length < 2) {
        resetTempDrawing();
        return;
      }

      const style = DRAWING_STYLES[type];
      const finalLayer =
        type === "polygon"
          ? L.polygon(points, style)
          : L.polyline(points, style);

      resetTempDrawing();
      registerLayer(type, finalLayer);
    },
    [registerLayer, resetTempDrawing],
  );

  // Cancel an in-progress drawing with Escape.
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        resetTempDrawing();
        setActiveTool("select");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [resetTempDrawing]);

  // Highlight the selected feature and restore the rest to their default style.
  useEffect(() => {
    layers.forEach((layer) => {
      if (!(layer.leafletLayer instanceof L.Path)) return;
      const baseStyle = DRAWING_STYLES[layer.type] ?? DRAWING_STYLES.default;

      if (layer.id === selectedLayerId) {
        layer.leafletLayer.setStyle({
          color: HIGHLIGHT_COLOR,
          weight: (baseStyle.weight ?? 2) + 2,
        });
        layer.leafletLayer.bringToFront();
      } else {
        layer.leafletLayer.setStyle(baseStyle);
      }
    });
  }, [selectedLayerId, layers]);

  // Wire up map interactions for whichever tool is currently active.
  useEffect(() => {
    if (!map) return undefined;

    resetTempDrawing();
    map.getContainer().style.cursor =
      activeTool === "select" ? "" : "crosshair";
    map.getContainer().style.userSelect =
      activeTool === "rectangle" || activeTool === "circle" ? "none" : "";

    // Native double-click zoom is disabled while sketching a multi-point
    // shape so a quick "finish" click near the last point doesn't also
    // zoom the map. Finishing itself is detected manually below.
    if (
      activeTool === "polyline" ||
      activeTool === "polygon" ||
      activeTool === "measure"
    ) {
      map.doubleClickZoom.disable();
    }

    const handlePointClick = (e: L.LeafletMouseEvent) => {
      const marker = L.marker(e.latlng, {
        icon: L.divIcon({
          className: "",
          html: pointIconHtml(),
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      });
      registerLayer("point", marker);
    };

    const makeClickHandler =
      (type: "polyline" | "polygon" | "measure") =>
      (e: L.LeafletMouseEvent) => {
        const now = Date.now();
        const last = lastClickRef.current;

        const isFinishClick =
          last.latlng !== null &&
          now - last.time < DOUBLE_CLICK_MS &&
          map
            .latLngToContainerPoint(e.latlng)
            .distanceTo(map.latLngToContainerPoint(last.latlng)) <
            DOUBLE_CLICK_PIXELS;

        if (isFinishClick) {
          lastClickRef.current = { time: 0, latlng: null };
          finishPolyshape(type);
          return;
        }

        lastClickRef.current = { time: now, latlng: e.latlng };
        drawingPointsRef.current = [...drawingPointsRef.current, e.latlng];
        renderPreview(type, drawingPointsRef.current);
      };

    const makeMouseMoveHandler =
      (type: "polyline" | "polygon" | "measure") =>
      (e: L.LeafletMouseEvent) => {
        if (drawingPointsRef.current.length === 0) return;
        renderPreview(type, [...drawingPointsRef.current, e.latlng]);
      };

    const polylineClick = makeClickHandler("polyline");
    const polylineMouseMove = makeMouseMoveHandler("polyline");

    const polygonClick = makeClickHandler("polygon");
    const polygonMouseMove = makeMouseMoveHandler("polygon");

    const measureClick = makeClickHandler("measure");
    const measureMouseMove = makeMouseMoveHandler("measure");

    let rectangleStart: L.LatLng | null = null;
    let circleCenter: L.LatLng | null = null;

    const handleRectangleMouseDown = (e: L.LeafletMouseEvent) => {
      L.DomEvent.preventDefault(e.originalEvent);
      rectangleStart = e.latlng;
      map.dragging.disable();
    };
    const handleRectangleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!rectangleStart) return;
      clearTempLayer();
      const preview = L.rectangle(L.latLngBounds(rectangleStart, e.latlng), {
        ...DRAWING_STYLES.rectangle,
        dashArray: "4 4",
      });
      tempLayerRef.current = preview;
      layerGroupRef.current?.addLayer(preview);
    };
    const handleRectangleMouseUp = (e: L.LeafletMouseEvent) => {
      if (!rectangleStart) return;
      const bounds = L.latLngBounds(rectangleStart, e.latlng);
      rectangleStart = null;
      resetTempDrawing();
      map.dragging.enable();
      if (bounds.getNorthEast().distanceTo(bounds.getSouthWest()) < 1) return;
      registerLayer("rectangle", L.rectangle(bounds, DRAWING_STYLES.rectangle));
    };

    const handleCircleMouseDown = (e: L.LeafletMouseEvent) => {
      L.DomEvent.preventDefault(e.originalEvent);
      circleCenter = e.latlng;
      map.dragging.disable();
    };
    const handleCircleMouseMove = (e: L.LeafletMouseEvent) => {
      if (!circleCenter) return;
      clearTempLayer();
      const preview = L.circle(circleCenter, {
        ...DRAWING_STYLES.circle,
        dashArray: "4 4",
        radius: circleCenter.distanceTo(e.latlng),
      });
      tempLayerRef.current = preview;
      layerGroupRef.current?.addLayer(preview);
    };
    const handleCircleMouseUp = (e: L.LeafletMouseEvent) => {
      if (!circleCenter) return;
      const center = circleCenter;
      const radius = center.distanceTo(e.latlng);
      circleCenter = null;
      resetTempDrawing();
      map.dragging.enable();
      if (radius < 1) return;
      registerLayer(
        "circle",
        L.circle(center, { ...DRAWING_STYLES.circle, radius }),
      );
    };

    switch (activeTool) {
      case "point":
        map.on("click", handlePointClick);
        break;
      case "polyline":
        map.on("click", polylineClick);
        map.on("mousemove", polylineMouseMove);
        break;
      case "polygon":
        map.on("click", polygonClick);
        map.on("mousemove", polygonMouseMove);
        break;
      case "measure":
        map.on("click", measureClick);
        map.on("mousemove", measureMouseMove);
        break;
      case "rectangle":
        map.on("mousedown", handleRectangleMouseDown);
        map.on("mousemove", handleRectangleMouseMove);
        map.on("mouseup", handleRectangleMouseUp);
        break;
      case "circle":
        map.on("mousedown", handleCircleMouseDown);
        map.on("mousemove", handleCircleMouseMove);
        map.on("mouseup", handleCircleMouseUp);
        break;
      default:
        break;
    }

    return () => {
      map.off("click", handlePointClick);
      map.off("click", polylineClick);
      map.off("mousemove", polylineMouseMove);
      map.off("click", polygonClick);
      map.off("mousemove", polygonMouseMove);
      map.off("click", measureClick);
      map.off("mousemove", measureMouseMove);
      map.off("mousedown", handleRectangleMouseDown);
      map.off("mousemove", handleRectangleMouseMove);
      map.off("mouseup", handleRectangleMouseUp);
      map.off("mousedown", handleCircleMouseDown);
      map.off("mousemove", handleCircleMouseMove);
      map.off("mouseup", handleCircleMouseUp);
      map.dragging.enable();
      map.doubleClickZoom.enable();
      map.getContainer().style.cursor = "";
      map.getContainer().style.userSelect = "";
    };
  }, [
    map,
    activeTool,
    registerLayer,
    resetTempDrawing,
    clearTempLayer,
    renderPreview,
    finishPolyshape,
  ]);

  const deleteLayer = useCallback((id: string) => {
    setLayers((prev) => {
      const target = prev.find((l) => l.id === id);
      if (target) layerGroupRef.current?.removeLayer(target.leafletLayer);
      return prev.filter((l) => l.id !== id);
    });
    setSelectedLayerId((current) => (current === id ? null : current));
  }, []);

  const toggleLayerVisibility = useCallback((id: string) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;
        const nextVisible = !layer.visible;
        if (nextVisible) layerGroupRef.current?.addLayer(layer.leafletLayer);
        else layerGroupRef.current?.removeLayer(layer.leafletLayer);
        return { ...layer, visible: nextVisible };
      }),
    );
  }, []);

  const renameLayer = useCallback((id: string, name: string) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, name } : l)));
  }, []);

  const addPointLayer = useCallback(
    (lat: number, lng: number, label?: string) => {
      const marker = L.marker([lat, lng], {
        icon: L.divIcon({
          className: "",
          html: pointIconHtml(),
          iconSize: [12, 12],
          iconAnchor: [6, 6],
        }),
      });
      if (label) marker.bindPopup(label);
      registerLayer("point", marker, label);
    },
    [registerLayer],
  );

  const clearAllLayers = useCallback(() => {
    layers.forEach((l) => layerGroupRef.current?.removeLayer(l.leafletLayer));
    setLayers([]);
    setSelectedLayerId(null);
  }, [layers]);

  const focusLayer = useCallback(
    (id: string) => {
      setSelectedLayerId(id);
      if (!map) return;

      const target = layers.find((l) => l.id === id);
      if (!target) return;

      const leafletLayer = target.leafletLayer;

      if (leafletLayer instanceof L.Marker) {
        map.setView(leafletLayer.getLatLng(), Math.max(map.getZoom(), 14));
      } else if (leafletLayer instanceof L.Circle) {
        map.fitBounds(leafletLayer.getBounds(), {
          padding: [40, 40],
          maxZoom: 16,
        });
      } else if (leafletLayer instanceof L.Polyline) {
        map.fitBounds(leafletLayer.getBounds(), {
          padding: [40, 40],
          maxZoom: 16,
        });
      }
    },
    [map, layers],
  );

  return {
    activeTool,
    setActiveTool,
    layers,
    selectedLayerId,
    selectLayer: focusLayer,
    deleteLayer,
    toggleLayerVisibility,
    renameLayer,
    addPointLayer,
    clearAllLayers,
  };
}
