import { useMemo, useState } from "react";

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
  magnitudeRange: [0, Number.POSITIVE_INFINITY],
  directionRange: [0, 360],
};

export function useWindRoseData(initialMode: WindRoseMode = "wind") {
  const [mode, setMode] = useState<WindRoseMode>(initialMode);
  const [records, setRecords] = useState<WindRoseRecord[]>([]);
  const [filters, setFilters] = useState<WindRoseFilters>(DEFAULT_FILTERS);
  const [classSettings, setClassSettings] = useState<WindRoseClassSettings>({
    sectorCount: DEFAULT_SECTOR_COUNT,
    breakpoints: getDefaultBreakpoints(initialMode),
  });

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  const setModeWithReset = (nextMode: WindRoseMode) => {
    setMode(nextMode);
    setClassSettings({
      sectorCount: DEFAULT_SECTOR_COUNT,
      breakpoints: getDefaultBreakpoints(nextMode),
    });
    setFilters(DEFAULT_FILTERS);
  };

  const derived = useMemo(() => {
    return {
      mode,
      records,
      filters,
      classSettings,
      setMode: setModeWithReset,
      setRecords,
      setFilters,
      setClassSettings,
      resetFilters,
    };
  }, [classSettings, filters, mode, records]);

  return derived;
}
