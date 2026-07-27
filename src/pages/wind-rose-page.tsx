import { useMemo } from "react";

import WindRoseToolbar from "../features/wind-rose/components/wind-rose-toolbar";
import WindRoseModeToggle from "../features/wind-rose/components/wind-rose-mode-toggle";
import WindRoseChart from "../features/wind-rose/components/wind-rose-chart";
import WindRoseLegend from "../features/wind-rose/components/wind-rose-legend";
import WindRoseStatisticsPanel from "../features/wind-rose/components/wind-rose-statistics-panel";
import WindRoseBeaufortTable from "../features/wind-rose/components/wind-rose-beaufort-table";
import WindRoseFilterPanel from "../features/wind-rose/components/wind-rose-filter-panel";
import WindRoseImportDialog from "../features/wind-rose/components/wind-rose-import-dialog";
import { useWindRoseImport } from "../features/wind-rose/hooks/use-wind-rose-import";
import { useWindRoseData } from "../features/wind-rose/hooks/use-wind-rose-data";
import { useWindRoseBins } from "../features/wind-rose/hooks/use-wind-rose-bins";
import { downloadTextFile } from "../services/file-service";
import {
  buildWindRoseSvgMarkup,
  type WindRoseFilters,
} from "../utils/wind-rose";

export default function WindRosePage() {
  const windRoseData = useWindRoseData("wind");
  const importDataset = useWindRoseImport();

  const analysis = useWindRoseBins({
    records: windRoseData.records,
    mode: windRoseData.mode,
    sectorCount: windRoseData.classSettings.sectorCount,
    breakpoints: windRoseData.classSettings.breakpoints,
    filters: windRoseData.filters,
  });

  const handleImportConfirm = () => {
    windRoseData.setRecords(importDataset.validRecords);
    importDataset.reset();
  };

  const handleExportCsv = () => {
    const rows = [
      ["observations", analysis.stats.observationCount],
      ["dominant_direction", analysis.stats.dominantDirection ?? ""],
      ["mean_direction", analysis.stats.meanDirection],
      ["mean_magnitude", analysis.stats.meanMagnitude],
      ["min_magnitude", analysis.stats.minMagnitude ?? ""],
      ["max_magnitude", analysis.stats.maxMagnitude ?? ""],
    ];
    const csv = rows.map((row) => row.join(",")).join("\n");
    downloadTextFile(`wind-rose-summary-${Date.now()}.csv`, csv, "text/csv");
  };

  const handleExportSvg = () => {
    const svgMarkup = buildWindRoseSvgMarkup(analysis, windRoseData.mode);
    downloadTextFile(
      `wind-rose-${windRoseData.mode}-${Date.now()}.svg`,
      svgMarkup,
      "image/svg+xml",
    );
  };

  const handleFiltersChange = (filters: WindRoseFilters) => {
    windRoseData.setFilters(filters);
  };

  const handleBreakpointsChange = (breakpoints: number[]) => {
    windRoseData.setClassSettings((current) => ({
      ...current,
      breakpoints,
    }));
  };

  const handleSectorCountChange = (sectorCount: number) => {
    windRoseData.setClassSettings((current) => ({
      ...current,
      sectorCount,
    }));
  };

  const handleReset = () => {
    windRoseData.resetFilters();
    windRoseData.setClassSettings((current) => ({
      ...current,
      sectorCount: 16,
      breakpoints: windRoseData.classSettings.breakpoints,
    }));
  };

  const magnitudeLabel = useMemo(
    () => (windRoseData.mode === "wind" ? "Speed (m/s)" : "Height (m)"),
    [windRoseData.mode],
  );

  return (
    <div className="flex h-full w-full min-h-0 overflow-hidden bg-slate-50">
      <div className="flex flex-1 min-h-0 flex-col gap-4 p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-3xl font-semibold text-slate-900">Wind Rose</h2>
            <p className="text-sm text-slate-600">
              Directional analysis for wind and wave observations.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <WindRoseModeToggle
              mode={windRoseData.mode}
              onChange={windRoseData.setMode}
            />
            <WindRoseToolbar
              onImportClick={importDataset.open}
              onExportCsv={handleExportCsv}
              onExportSvg={handleExportSvg}
              hasData={analysis.records.length > 0}
            />
          </div>
        </div>

        <div className="grid flex-1 min-h-0 gap-4 xl:grid-cols-[1.4fr_0.6fr]">
          <div className="flex min-h-0 flex-col gap-4">
            <WindRoseChart analysis={analysis} mode={windRoseData.mode} />
            <div className="grid grid-cols-2 gap-4">
              <WindRoseStatisticsPanel
                analysis={analysis}
                mode={windRoseData.mode}
              />
              <WindRoseLegend analysis={analysis} mode={windRoseData.mode} />
            </div>
          </div>

          <aside className="flex min-h-0 flex-col gap-4 overflow-y-auto">
            <WindRoseFilterPanel
              mode={windRoseData.mode}
              filters={windRoseData.filters}
              sectorCount={windRoseData.classSettings.sectorCount}
              breakpoints={windRoseData.classSettings.breakpoints}
              onFiltersChange={handleFiltersChange}
              onSectorCountChange={handleSectorCountChange}
              onBreakpointsChange={handleBreakpointsChange}
              onReset={handleReset}
            />
            <WindRoseBeaufortTable mode={windRoseData.mode} />
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">
                Current settings
              </p>
              <div className="mt-3 space-y-2 text-sm text-slate-600">
                <div className="flex items-center justify-between">
                  <span>Mode</span>
                  <span className="font-medium text-slate-900">
                    {windRoseData.mode === "wind" ? "Wind" : "Wave"}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span>Magnitude unit</span>
                  <span className="font-medium text-slate-900">
                    {magnitudeLabel}
                  </span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <WindRoseImportDialog
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
