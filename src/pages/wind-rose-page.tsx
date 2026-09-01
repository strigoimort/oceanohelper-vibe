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

  return (
    <div className="w-full min-w-0 space-y-6">
      <div className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
            <h2 className="text-3xl font-semibold text-slate-900">Wind Rose</h2>
            <p className="text-sm text-slate-600">
              Directional analysis for wind and wave observations.
            </p>
          </div>
        <div className="flex min-w-0 flex-wrap items-center gap-2">
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

      <div className="grid min-w-0 grid-cols-12 items-start gap-6">
        <section className="col-span-12 min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-7">
          <div className="mb-4 flex min-w-0 flex-wrap items-baseline justify-between gap-2">
            <h3 className="text-base font-semibold text-slate-900">
              {windRoseData.mode === "wind" ? "Wind rose" : "Wave rose"}
            </h3>
            <p className="text-xs text-slate-400">
              {analysis.sectorCount} sectors · {analysis.breakpoints.length} magnitude classes
            </p>
          </div>
          <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center">
            <WindRoseChart analysis={analysis} />
            <WindRoseLegend analysis={analysis} mode={windRoseData.mode} />
          </div>
        </section>

        <div className="col-span-12 flex min-w-0 flex-col gap-6 lg:col-span-5">
            <WindRoseStatisticsPanel analysis={analysis} mode={windRoseData.mode} />
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
        </div>
        <WindRoseBeaufortTable mode={windRoseData.mode} />
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
