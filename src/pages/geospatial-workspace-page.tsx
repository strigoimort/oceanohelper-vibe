import { useState } from "react";
import L from "leaflet";
import type { FeatureCollection } from "geojson";

import GeospatialMap from "../features/geospatial-workspace/components/geospatial-map";
import GeospatialPropertiesPanel from "../features/geospatial-workspace/components/geospatial-properties-panel";
import GeospatialToolbar from "../features/geospatial-workspace/components/geospatial-toolbar";
import GeospatialImportDialog from "../features/geospatial-workspace/components/geospatial-import-dialog";
// import { exportElementAsPng, downloadTextFile } from "../services/file-service";
import { downloadTextFile } from "../services/file-service";
import { useDrawingTools } from "../features/geospatial-workspace/hooks/use-drawing-tools";
import { useDatasetImport } from "../features/geospatial-workspace/hooks/use-dataset-import";
import { layersToGeoJson } from "../utils/geo-export";
import type { BasemapId } from "../constants/basemaps";

export default function GeospatialWorkspacePage() {
  const [cursor, setCursor] = useState<{ lat: number; lng: number } | null>(
    null,
  );
  const [zoom, setZoom] = useState(2);
  const [map, setMap] = useState<L.Map | null>(null);
  const [basemap, setBasemap] = useState<BasemapId>("ocean");

  const {
    activeTool,
    setActiveTool,
    layers,
    selectedLayerId,
    selectLayer,
    deleteLayer,
    toggleLayerVisibility,
    renameLayer,
    addPointLayer,
    addGeoJsonLayer,
  } = useDrawingTools(map);

  const importDataset = useDatasetImport();

  const handleImportConfirm = () => {
    if (importDataset.kind === "csv") {
      const bounds: [number, number][] = [];
      importDataset.validRecords.forEach((record) => {
        addPointLayer(record.lat, record.lng, record.name);
        bounds.push([record.lat, record.lng]);
      });
      if (map && bounds.length > 0)
        map.fitBounds(bounds, { padding: [40, 40] });
    }

    if (importDataset.kind === "shapefile") {
      importDataset.shapefileFeatures.forEach((feature, index) => {
        addGeoJsonLayer(feature, `Feature ${index + 1}`);
      });

      if (map) {
        const bounds = L.geoJSON({
          type: "FeatureCollection",
          features: importDataset.shapefileFeatures,
        } as FeatureCollection).getBounds();
        if (bounds.isValid()) map.fitBounds(bounds, { padding: [40, 40] });
      }
    }

    importDataset.reset();
  };

  const handleExportGeoJson = () => {
    if (layers.length === 0) return;
    const geojson = layersToGeoJson(layers);
    downloadTextFile(
      `oceanohelper-layers-${Date.now()}.geojson`,
      JSON.stringify(geojson, null, 2),
      "application/geo+json",
    );
  };

  // const handleExportPng = async () => {
  //   if (!map) return;

  //   try {
  //     await exportElementAsPng(
  //       map.getContainer(),
  //       `oceanohelper-map-${Date.now()}.png`,
  //     );
  //   } catch (error) {
  //     console.error(error);
  //     window.alert(
  //       basemap === "streets"
  //         ? "Export PNG tidak didukung untuk basemap Streets (tile OpenStreetMap tidak mengizinkan CORS). Ganti ke Dark/Ocean/Satellite/Terrain lalu coba lagi."
  //         : "Gagal export PNG. Pastikan package 'html2canvas' sudah terinstall (pnpm add html2canvas), lalu coba lagi.",
  //     );
  //   }
  // };

  return (
    <div className="flex h-full w-full min-h-0 overflow-hidden bg-slate-50">
      <div className="flex min-w-0 flex-1 min-h-0 flex-col">
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0">
            <GeospatialMap
              onCursorMove={setCursor}
              onZoomChange={setZoom}
              onMapReady={setMap}
              basemap={basemap}
            />
          </div>

          <div className="pointer-events-none absolute bottom-1 right-1 z-1000 flex items-center gap-3 whitespace-nowrap border border-slate-300 bg-white px-2.5 py-1 text-xs text-slate-700 shadow-sm">
            <span>
              <span className="text-slate-500">Lat </span>
              {cursor ? cursor.lat.toFixed(4) : "00.0000"}
            </span>
            <span>
              <span className="text-slate-500">Lon </span>
              {cursor ? cursor.lng.toFixed(4) : "000.0000"}
            </span>
            <span>
              <span className="text-slate-500">Zoom </span>
              {zoom}
            </span>
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-10 z-1000 flex justify-center">
            <div className="pointer-events-auto">
              <GeospatialToolbar
                activeTool={activeTool}
                onToolChange={setActiveTool}
                onImportClick={importDataset.open}
                onExportGeoJson={handleExportGeoJson}
                // onExportPng={handleExportPng}
                hasLayers={layers.length > 0}
                basemap={basemap}
                onBasemapChange={setBasemap}
              />
            </div>
          </div>
        </div>
      </div>

      <aside className="w-[320px] shrink-0 flex flex-col border-l border-slate-200 bg-white">
        <div className="min-h-0 flex-1 overflow-hidden p-4">
          <GeospatialPropertiesPanel
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={selectLayer}
            onDeleteLayer={deleteLayer}
            onToggleVisibility={toggleLayerVisibility}
            onRenameLayer={renameLayer}
          />
        </div>
      </aside>

      <GeospatialImportDialog
        isOpen={importDataset.isOpen}
        kind={importDataset.kind}
        fileName={importDataset.fileName}
        error={importDataset.error}
        onFileSelect={importDataset.loadFile}
        onConfirm={handleImportConfirm}
        onClose={importDataset.reset}
        headers={importDataset.headers}
        rowCount={importDataset.rows.length}
        validCount={importDataset.validRecords.length}
        mapping={importDataset.mapping}
        onMappingChange={importDataset.setMapping}
        shapefileFeatures={importDataset.shapefileFeatures}
      />
    </div>
  );
}
