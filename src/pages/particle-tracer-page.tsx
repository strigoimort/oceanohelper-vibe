import { useCallback, useMemo, useState } from "react";
import L from "leaflet";

import GeospatialMap from "../features/geospatial-workspace/components/geospatial-map";
import ParticleToolbar from "../features/particle-tracer/components/particle-toolbar";
import ParticleTimeline from "../features/particle-tracer/components/particle-timeline";
import ParticleLayerPanel from "../features/particle-tracer/components/particle-layer-panel";
import ParticleInfoPanel from "../features/particle-tracer/components/particle-info-panel";
import ParticleForecastPanel, {
  type ForecastSettings,
} from "../features/particle-tracer/components/particle-forecast-panel";
import ParticleImportDialog from "../features/particle-tracer/components/particle-import-dialog";

import { useParticleDatasets } from "../features/particle-tracer/hooks/use-particle-datasets";
import { useParticleImport } from "../features/particle-tracer/hooks/use-particle-import";
import { useParticleAnimation } from "../features/particle-tracer/hooks/use-particle-animation";
import { useParticleLayers } from "../features/particle-tracer/hooks/use-particle-layers";

import { downloadTextFile } from "../services/file-service";
import { particleDatasetsToGeoJson } from "../utils/geo-export";
import {
  buildTrajectories,
  getTimelineTimestamps,
} from "../utils/particle-tracer";
import {
  DEFAULT_FORECAST_DURATION_HOURS,
  DEFAULT_FORECAST_INTERVAL_HOURS,
} from "../constants/particle-tracer";
import type { BasemapId } from "../constants/basemaps";

export default function ParticleTracerPage() {
  const [map, setMap] = useState<L.Map | null>(null);
  const [basemap, setBasemap] = useState<BasemapId>("ocean");
  const [forecast, setForecast] = useState<ForecastSettings>({
    enabled: false,
    durationHours: DEFAULT_FORECAST_DURATION_HOURS,
    intervalHours: DEFAULT_FORECAST_INTERVAL_HOURS,
  });

  const {
    datasets,
    addDataset,
    removeDataset,
    toggleDatasetVisibility,
    clearAllDatasets,
    selectedParticle,
    setSelectedParticle,
  } = useParticleDatasets();

  const importDataset = useParticleImport();

  const timestamps = useMemo(() => getTimelineTimestamps(datasets), [datasets]);
  const animation = useParticleAnimation(timestamps);

  useParticleLayers({
    map,
    datasets,
    currentTime: animation.currentTime,
    onSelectParticle: setSelectedParticle,
    selectedParticle,
    forecast,
  });

  const handleImportConfirm = useCallback(() => {
    const trajectories = buildTrajectories(importDataset.validRecords);
    addDataset(importDataset.fileName ?? "Dataset", trajectories);

    if (map) {
      const allPoints: [number, number][] = trajectories.flatMap((t) =>
        t.points.map((p): [number, number] => [p.lat, p.lng]),
      );
      if (allPoints.length > 0) map.fitBounds(allPoints, { padding: [40, 40] });
    }

    importDataset.reset();
  }, [importDataset, addDataset, map]);

  const handleExportGeoJson = useCallback(() => {
    if (datasets.length === 0) return;
    const geojson = particleDatasetsToGeoJson(datasets);
    downloadTextFile(
      `oceanohelper-trajectories-${Date.now()}.geojson`,
      JSON.stringify(geojson, null, 2),
      "application/geo+json",
    );
  }, [datasets]);

  return (
    <div className="flex h-full w-full min-h-0 overflow-hidden bg-slate-50">
      <div className="flex flex-1 min-h-0 flex-col">
        <div className="relative flex-1 min-h-0">
          <div className="absolute inset-0">
            <GeospatialMap onMapReady={setMap} basemap={basemap} />
          </div>

          <div className="pointer-events-none absolute inset-x-0 bottom-4 z-1000 flex justify-center">
            <div className="pointer-events-auto">
              <ParticleToolbar
                onImportClick={importDataset.open}
                onClearAll={clearAllDatasets}
                onExportGeoJson={handleExportGeoJson}
                hasDatasets={datasets.length > 0}
                basemap={basemap}
                onBasemapChange={setBasemap}
              />
            </div>
          </div>
        </div>

        <div className="h-16 shrink-0">
          <ParticleTimeline
            currentTime={animation.currentTime}
            frameIndex={animation.frameIndex}
            maxIndex={animation.maxIndex}
            isPlaying={animation.isPlaying}
            speed={animation.speed}
            onSpeedChange={animation.setSpeed}
            onPlay={animation.play}
            onPause={animation.pause}
            onStop={animation.stop}
            onStepForward={animation.stepForward}
            onStepBackward={animation.stepBackward}
            onSeek={animation.seek}
            disabled={animation.maxIndex === 0}
            hasDatasets={datasets.length > 0}
          />
        </div>
      </div>

      <aside className="flex w-[320px] flex-col gap-4 overflow-y-auto border-l border-slate-200 bg-white p-4">
        <ParticleLayerPanel
          datasets={datasets}
          onToggleVisibility={toggleDatasetVisibility}
          onRemoveDataset={removeDataset}
        />
        <ParticleInfoPanel
          datasets={datasets}
          currentTime={animation.currentTime}
          selectedParticle={selectedParticle}
        />
        <ParticleForecastPanel
          key={`${forecast.durationHours}-${forecast.intervalHours}`}
          settings={forecast}
          onChange={setForecast}
        />
      </aside>

      <ParticleImportDialog
        isOpen={importDataset.isOpen}
        fileName={importDataset.fileName}
        error={importDataset.error}
        headers={importDataset.headers}
        rowCount={importDataset.rows.length}
        validCount={importDataset.validRecords.length}
        mapping={importDataset.mapping}
        onMappingChange={importDataset.setMapping}
        onFileSelect={importDataset.loadFile}
        onConfirm={handleImportConfirm}
        onClose={importDataset.reset}
      />
    </div>
  );
}
