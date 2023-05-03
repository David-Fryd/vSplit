export type FacilityGeoJSON = {
  type: string;
  features: FacilityFeature[];
};

// FacilityFeature is A single "volume" (polygon associated w/ sectors & alts by the properties)
export type FacilityFeature = {
  type: string; // "Feature" (Enforced in validation)
  properties: {
    /// SectorID -> AltitudeRange
    [key: string]: string; // "23" : "0-999"
    // NOTE: All properties are treated as if
    // they are sector names/altitudes corresponding to the FacilityFeature
    // NOTE: This is a result of encouraging people to build their GeoJSON
    // files with geojson.io, which when you add a property adds it as a "key -> value"
    // preventing us from using a more strucutred approach like properties: {{sector: string, altitudes: string}[]}
  };
  geometry: FacilityGeometry;
  id?: number;
};

export type FacilityGeometry = {
  coordinates: number[][][]; // [[[long, lat], [long, lat], ...], ...]]]
  type: string; // "Polygon" (Enforced in validation)
};

// import type { LatLngExpression } from "leaflet";

// export type GeoJSON = {
//   type: string;
//   features: {
//     type: string;
//     geometry: {
//       type: string;
//       coordinates: LatLngExpression[];
//     };
//     properties: unknown;
//   }[];
// };
