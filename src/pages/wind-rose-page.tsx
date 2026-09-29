import { Upload, Waves, Wind } from "lucide-react";

import Card from "../components/ui/card";
import EmptyState from "../components/ui/empty-state";
import WindRoseToolbar from "../features/wind-rose/components/wind-rose-toolbar";
import WindRoseModeToggle from "../features/wind-rose/components/wind-rose-mode-toggle";
import WindRoseChart from "../features/wind-rose/components/wind-rose-chart";
import WindRoseLegend from "../features/wind-rose/components/wind-rose-legend";
import WindRoseStatisticsPanel from "../features/wind-rose/components/wind-rose-statistics-panel";
import WindRoseBeaufortTable from "../features/wind-rose/components/wind-rose-beaufort-table";
import WindRoseFilterPanel from "../features/wind-rose/components/wind-rose-filter-panel";
import WindRoseSettingsPanel from "../features/wind-rose/components/wind-rose-settings-panel";
import WindRoseImportDialog from "../features/wind-rose/components/wind-rose-import-dialog";
import { useWindRoseImport } from "../features/wind-rose/hooks/use-wind-rose-import";
import { useWindRoseExport } from "../features/wind-rose/hooks/use-wind-rose-export";
import { useWindRoseData } from "../features/wind-rose/hooks/use-wind-rose-data";
import { useWindRoseBins } from "../features/wind-rose/hooks/use-wind-rose-bins";
import { hasActiveFilters } from "../utils/wind-rose";

export default function WindRosePage() {
  const windRoseData = useWindRoseData("wind");
  const importDataset = useWindRoseImport();

  const { mode, records, filters, classSettings } = windRoseData;

  const analysis = useWindRoseBins({
    records,
    mode,
    sectorCount: classSettings.sectorCount,
    breakpoints: classSettings.breakpoints,
    filters,
  });

  const exporter = useWindRoseExport(analysis, mode);

  const isWind = mode === "wind";
  const hasData = records.length > 0;
  const hasResults = analysis.records.length > 0;

  const observationSummary = hasActiveFilters(filters)
    ? `${analysis.records.length} of ${records.length} observations`
    : `${records.length} observations`;

  const handleImportConfirm = () => {
    windRoseData.setRecords(importDataset.validRecords);
    importDataset.reset();
  };

  return (
    <div className="w-full min-w-0 space-y-6">
      <header className="flex min-w-0 flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className=" page-title">Wind Rose</h2>
          <p className="page-description">
            Directional analysis for wind and wave observations.
          </p>
        </div>

        <div className="flex min-w-0 flex-wrap items-center gap-2">
          <WindRoseModeToggle mode={mode} onChange={windRoseData.setMode} />
          <WindRoseToolbar
            onImportClick={importDataset.open}
            onExport={exporter.exportAs}
            hasData={hasResults}
          />
        </div>
      </header>

      {exporter.error && (
        <p
          role="alert"
          className="rounded-xl bg-red-50 px-4 py-2 text-sm text-red-700"
        >
          {exporter.error}
        </p>
      )}

      {!hasData ? (
        <Card padded={false}>
          <EmptyState
            icon={isWind ? <Wind size={22} /> : <Waves size={22} />}
            title="No dataset imported"
            description={`Import a CSV or Excel (.xlsx) file with a direction column (degrees) and a ${
              isWind ? "wind speed (m/s)" : "wave height (m)"
            } column to generate the rose diagram.`}
            action={
              <button
                type="button"
                onClick={importDataset.open}
                className="inline-flex items-center gap-2 rounded-xl bg-accent px-4 py-2 text-sm font-medium text-white transition hover:bg-accent-hover"
              >
                <Upload size={16} />
                Import dataset
              </button>
            }
          />
        </Card>
      ) : (
        <div className="grid min-w-0 grid-cols-12 items-start gap-6">
          <Card className="col-span-12 lg:col-span-7">
            <div className="mb-4 flex min-w-0 flex-wrap items-baseline justify-between gap-2">
              <h3 className="section-title">
                {isWind ? "Wind rose" : "Wave rose"}
              </h3>
              <p className="text-xs text-slate-400">
                {observationSummary} · {analysis.sectorCount} sectors
              </p>
            </div>

            {hasResults ? (
              <div className="flex min-w-0 flex-col gap-6 lg:flex-row lg:items-center">
                <WindRoseChart analysis={analysis} mode={mode} />
                <WindRoseLegend analysis={analysis} mode={mode} />
              </div>
            ) : (
              <EmptyState
                title="No observations match the current filters"
                description="Widen the date, magnitude, or direction range to see data again."
                action={
                  <button
                    type="button"
                    onClick={windRoseData.resetFilters}
                    className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                  >
                    Reset filters
                  </button>
                }
              />
            )}
          </Card>

          <div className="col-span-12 flex min-w-0 flex-col gap-6 lg:col-span-5">
            <WindRoseStatisticsPanel analysis={analysis} mode={mode} />
            <WindRoseFilterPanel
              mode={mode}
              filters={filters}
              onFiltersChange={windRoseData.setFilters}
              onReset={windRoseData.resetFilters}
            />
            <WindRoseSettingsPanel
              mode={mode}
              sectorCount={classSettings.sectorCount}
              breakpoints={classSettings.breakpoints}
              onSectorCountChange={windRoseData.setSectorCount}
              onBreakpointsChange={windRoseData.setBreakpoints}
              onReset={windRoseData.resetClassSettings}
            />
          </div>

          <WindRoseBeaufortTable
            mode={mode}
            activeNumber={analysis.beaufortClass?.number ?? null}
          />
        </div>
      )}

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
