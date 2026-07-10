declare module "shpjs" {
  import type { FeatureCollection } from "geojson";

  export default function shp(
    data: ArrayBuffer | string,
  ): Promise<FeatureCollection | FeatureCollection[]>;
}
