import type {
  FacilityGeoJSON,
  FacilityFeature,
  FacilityGeometry,
} from "~/types/facilityData";

// TODO: Validation is pretty basic right now, but it's better than nothing
// TODO: Add more granular failure

function isFeatureCandidate(obj: unknown): obj is FacilityFeature {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    "properties" in obj &&
    "geometry" in obj
  );
}

function isFacilityGeoJSONCandidate(obj: unknown): obj is FacilityGeoJSON {
  console.log("facility geojson candidate checking");
  console.log("type of obj: " + typeof obj);
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    "features" in obj
  );
}

function isFacilityGeometryCandidate(obj: unknown): obj is FacilityGeometry {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "type" in obj &&
    "coordinates" in obj
  );
}

/**
 * Given the raw data from a facility's .geojson sector file, parse it into a FacilityGeoJSON object
 * @param data The raw string data loaded from a facility's .geojson sector file
 * @returns Parsed FacilityGeoJSON if the data is valid
 * @throws Error if the data is invalid
 */
export function parseFacilityGeoJSON(data: unknown): FacilityGeoJSON {
  if (typeof data !== "string") {
    throw new Error("Invalid input type: expected a raw string from a file");
  }
  const jsonData = JSON.parse(data) as unknown;

  if (!isFacilityGeoJSONCandidate(jsonData)) {
    throw new Error(
      "The data is not a FacilityGeoJSON candidate (lacks type or features high-level field)"
    );
  }

  if (jsonData.type !== "FeatureCollection") {
    throw new Error("The data is not of type 'FeatureCollection'");
  }

  if (!Array.isArray(jsonData.features)) {
    throw new Error("The features property is not an array");
  }

  jsonData.features.forEach((feature: unknown, index: number) => {
    if (!isFeatureCandidate(feature)) {
      throw new Error(`Feature at index ${index} is not a valid candidate`);
    }

    if (feature.type !== "Feature") {
      throw new Error(`Feature at index ${index} has an invalid type`);
    }

    if (feature.properties === undefined) {
      throw new Error(`Feature at index ${index} has undefined properties`);
    }

    if (!isFacilityGeometryCandidate(feature.geometry)) {
      throw new Error(
        `Geometry of feature at index ${index} is not a valid candidate`
      );
    }

    if (feature.geometry.type !== "Polygon") {
      throw new Error(
        `Geometry type of feature at index ${index} is not 'Polygon'`
      );
    }

    if (!Array.isArray(feature.geometry.coordinates)) {
      throw new Error(
        `Coordinates of the geometry at feature index ${index} are not an array`
      );
    }
  });

  return jsonData; // (as FacilityGeoJSON)
}
