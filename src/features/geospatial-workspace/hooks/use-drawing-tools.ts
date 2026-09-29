import { useCallback, useEffect, useRef, useState } from "react";
import L from "leaflet";
import type { Feature } from "geojson";

import { DRAWING_STYLES, FILL_OPACITY_RATIO } from "../../../constants/drawing";
import { calculateLineLength, formatDistance } from "../../../utils/geometry";
import {
  applyLayerAppearance,
  markerIconHtml,
} from "../../../utils/layer-style";

export type DrawingToolType =
  | "select"
  | "point"
  | "polyline"
  | "polygon"
  | "rectangle"
  | "circle"
  | "measure";

/** Layers can also be created outside the toolbar (a dataset import),
 * hence "dataset" on top of the active drawing tools above. */
export type DrawnLayerType = DrawingToolType | "dataset";

export type DrawnLayer = {
  id: string;
  type: DrawnLayerType;
  name: string;
  color: string;
  opacity: number;
  visible: boolean;
  leafletLayer: L.Layer;
  /** Number of points contained in a "dataset" layer. */
  featureCount?: number;
};

const HIGHLIGHT_COLOR = "#f59e0b";
const HALO_WEIGHT_BOOST = 6;
const HALO_OPACITY = 0.45;
const DOUBLE_CLICK_MS = 400;
const DOUBLE_CLICK_PIXELS = 12;

let layerCounter = 0;
const nextLayerId = () => `layer-${Date.now()}-${layerCounter++}`;

function labelForType(type: DrawnLayerType) {
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
    case "dataset":
      return "Dataset";
    default:
      return "Feature";
  }
}

/**
 * Builds a non-interactive outline that sits behind `source` to signal
 * "selected" without touching the shape's own color/style. Returns null
 * for shapes the halo doesn't know how to clone (there are none currently,
 * but this keeps the function total rather than throwing).
 */
function createHaloLayer(source: L.Path, weight: number): L.Path | null {
  const haloStyle: L.PathOptions = {
    color: HIGHLIGHT_COLOR,
    weight,
    opacity: HALO_OPACITY,
    fill: false,
    interactive: false,
  };

  if (source instanceof L.Circle) {
    return L.circle(source.getLatLng(), {
      ...haloStyle,
      radius: source.getRadius(),
    });
  }

  if (source instanceof L.Polygon) {
    // Single-ring assumption, consistent with utils/geometry.ts.
    const latlngs = (source.getLatLngs()[0] as L.LatLng[]) ?? [];
    return L.polygon(latlngs, haloStyle);
  }

  if (source instanceof L.Polyline) {
    return L.polyline(source.getLatLngs() as L.LatLng[], haloStyle);
  }

  return null;
}

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
  const haloLayerRef = useRef<L.Layer | null>(null);
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
    (
      type: DrawnLayerType,
      leafletLayer: L.Layer,
      customName?: string,
      featureCount?: number,
    ) => {
      const id = nextLayerId();
      const color = String(
        DRAWING_STYLES[type]?.color ?? DRAWING_STYLES.default.color,
      );

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
          color,
          opacity: 1,
          visible: true,
          leafletLayer,
          featureCount,
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

  // Every Path layer keeps its own true color/opacity at all times — the
  // selected shape is never recolored. Instead, a separate halo outline is
  // drawn behind it to signal selection, so a custom color is visible
  // immediately even while its layer is selected.
  useEffect(() => {
    if (haloLayerRef.current) {
      layerGroupRef.current?.removeLayer(haloLayerRef.current);
      haloLayerRef.current = null;
    }

    layers.forEach((layer) => {
      if (!(layer.leafletLayer instanceof L.Path)) return;

      const baseWeight = DRAWING_STYLES[layer.type]?.weight ?? 2;

      layer.leafletLayer.setStyle({
        color: layer.color,
        weight: baseWeight,
        opacity: layer.opacity,
        fillOpacity: layer.opacity * FILL_OPACITY_RATIO,
      });

      if (layer.id === selectedLayerId) {
        const halo = createHaloLayer(
          layer.leafletLayer,
          baseWeight + HALO_WEIGHT_BOOST,
        );
        if (halo) {
          layerGroupRef.current?.addLayer(halo);
          haloLayerRef.current = halo;
        }
        layer.leafletLayer.bringToFront();
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
          html: markerIconHtml(String(DRAWING_STYLES.point.color)),
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

  // Path layers (polygon/circle/etc.) are restyled by the highlight effect
  // above, keyed on `layers`; only markers and marker groups (which that
  // effect skips) need to be repainted here directly.
  const setLayerColor = useCallback((id: string, color: string) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;
        if (!(layer.leafletLayer instanceof L.Path)) {
          applyLayerAppearance(layer.leafletLayer, color, layer.opacity);
        }
        return { ...layer, color };
      }),
    );
  }, []);

  const setLayerOpacity = useCallback((id: string, opacity: number) => {
    setLayers((prev) =>
      prev.map((layer) => {
        if (layer.id !== id) return layer;
        if (!(layer.leafletLayer instanceof L.Path)) {
          applyLayerAppearance(layer.leafletLayer, layer.color, opacity);
        }
        return { ...layer, opacity };
      }),
    );
  }, []);

  /** Imports a full dataset (e.g. a CSV/Excel table of points) as a
   * single layer, instead of one layer per row. */
  const addPointDataset = useCallback(
    (
      records: { lat: number; lng: number; name?: string }[],
      datasetName: string,
    ) => {
      const color = String(DRAWING_STYLES.dataset.color);

      const markers = records.map((record) => {
        const marker = L.marker([record.lat, record.lng], {
          icon: L.divIcon({
            className: "",
            html: markerIconHtml(color),
            iconSize: [12, 12],
            iconAnchor: [6, 6],
          }),
        });
        if (record.name) marker.bindPopup(record.name);
        return marker;
      });

      // FeatureGroup (not plain LayerGroup) so a click on any marker
      // bubbles up as a click on the group itself, selecting the layer.
      const group = L.featureGroup(markers);
      return registerLayer("dataset", group, datasetName, records.length);
    },
    [registerLayer],
  );

  function inferDrawingType(layer: L.Layer): DrawingToolType {
    if (layer instanceof L.Marker) return "point";
    if (layer instanceof L.Polygon) return "polygon"; // check before Polyline (Polygon extends it)
    if (layer instanceof L.Polyline) return "polyline";
    return "point";
  }

  const addGeoJsonLayer = useCallback(
    (feature: Feature, label?: string) => {
      const geoLayer = L.geoJSON(feature, {
        pointToLayer: (_, latlng) =>
          L.marker(latlng, {
            icon: L.divIcon({
              className: "",
              html: markerIconHtml(String(DRAWING_STYLES.point.color)),
              iconSize: [12, 12],
              iconAnchor: [6, 6],
            }),
          }),
        style: (f) => {
          const geomType = f?.geometry?.type ?? "";
          return geomType.includes("Polygon")
            ? DRAWING_STYLES.polygon
            : DRAWING_STYLES.polyline;
        },
      });

      geoLayer.eachLayer((subLayer) => {
        registerLayer(inferDrawingType(subLayer), subLayer, label);
      });
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
      } else if (
        leafletLayer instanceof L.Circle ||
        leafletLayer instanceof L.Polyline ||
        leafletLayer instanceof L.FeatureGroup
      ) {
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
    setLayerColor,
    setLayerOpacity,
    addPointDataset,
    addGeoJsonLayer,
    clearAllLayers,
  };
}
