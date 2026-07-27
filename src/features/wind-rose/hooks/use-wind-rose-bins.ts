import { useMemo } from "react";

import type { WindRoseMode } from "../../../constants/wind-rose";
import {
  buildWindRoseAnalysis,
  type WindRoseFilters,
  type WindRoseRecord,
} from "../../../utils/wind-rose";

export function useWindRoseBins({
  records,
  mode,
  sectorCount,
  breakpoints,
  filters,
}: {
  records: WindRoseRecord[];
  mode: WindRoseMode;
  sectorCount: number;
  breakpoints: number[];
  filters: WindRoseFilters;
}) {
  return useMemo(
    () =>
      buildWindRoseAnalysis(records, mode, sectorCount, breakpoints, filters),
    [breakpoints, filters, mode, records, sectorCount],
  );
}
