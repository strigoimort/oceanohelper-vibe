import { useState } from "react";

import {
  DEFAULT_SECTOR_COUNT,
  getDefaultBreakpoints,
  type WindRoseMode,
} from "../../../constants/wind-rose";
import type { WindRoseFilters, WindRoseRecord } from "../../../utils/wind-rose";

export type WindRoseClassSettings = {
  sectorCount: number;
  breakpoints: number[];
};

const DEFAULT_FILTERS: WindRoseFilters = {
  dateFrom: null,
  dateTo: null,
  magnitudeMin: null,
  magnitudeMax: null,
  directionFrom: null,
  directionTo: null,
};

function createDefaultClassSettings(mode: WindRoseMode): WindRoseClassSettings {
  return {
    sectorCount: DEFAULT_SECTOR_COUNT,
    breakpoints: getDefaultBreakpoints(mode),
  };
}

export function useWindRoseData(initialMode: WindRoseMode = "wind") {
  const [mode, setMode] = useState<WindRoseMode>(initialMode);
  const [records, setRecords] = useState<WindRoseRecord[]>([]);
  const [filters, setFilters] = useState<WindRoseFilters>(DEFAULT_FILTERS);
  const [classSettings, setClassSettings] = useState<WindRoseClassSettings>(
    () => createDefaultClassSettings(initialMode),
  );

  const changeMode = (nextMode: WindRoseMode) => {
    setMode(nextMode);
    setClassSettings(createDefaultClassSettings(nextMode));
    setFilters(DEFAULT_FILTERS);
  };

  const setSectorCount = (sectorCount: number) => {
    setClassSettings((current) => ({ ...current, sectorCount }));
  };

  const setBreakpoints = (breakpoints: number[]) => {
    setClassSettings((current) => ({ ...current, breakpoints }));
  };

  const resetFilters = () => setFilters(DEFAULT_FILTERS);

  const resetClassSettings = () =>
    setClassSettings(createDefaultClassSettings(mode));

  return {
    mode,
    records,
    filters,
    classSettings,
    setMode: changeMode,
    setRecords,
    setFilters,
    setSectorCount,
    setBreakpoints,
    resetFilters,
    resetClassSettings,
  };
}
