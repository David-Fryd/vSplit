import type { LatLngExpression } from "leaflet";

export type GeoJSON = {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: LatLngExpression[];
    };
    properties: unknown;
  }[];
};
