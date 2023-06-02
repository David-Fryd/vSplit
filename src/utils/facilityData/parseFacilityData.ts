import type {
  FIRMetadata,
  FacilityData,
  Volume,
  Sectors,
  Geojson,
  Ownership,
  // AltitudeRange,
} from "~/types/facilityData";

// TODO: This file isn't really "parsing" the data, it's just validating its shape. Rename to "validateFacilityData.js"?

function isFacilityData(data: unknown): data is FacilityData {
  if (typeof data !== "object" || data === null) {
    throw new Error(
      "Invalid FacilityData: data should be an object. Instead, was " +
        typeof data
    );
  }

  const dataObject = data as { [k: string]: unknown };

  if (
    !("sectors" in dataObject) ||
    !("volumes" in dataObject) ||
    !("fir" in dataObject)
  ) {
    throw new Error(
      "Invalid FacilityData: data should contain fir, sectors, and volumes"
    );
  }

  if (!isFirMetadata(dataObject.fir)) {
    throw new Error(
      "Invalid FacilityData: fir (fir metadata) field is not valid"
    );
  }

  if (!isSectors(dataObject.sectors)) {
    throw new Error("Invalid FacilityData: sectors is not valid");
  }

  if (
    !Array.isArray(dataObject.volumes) ||
    !dataObject.volumes.every((volume) => isVolume(volume))
  ) {
    throw new Error("Invalid FacilityData: volumes is not valid");
  }

  return true;
}

function isFirMetadata(data: unknown): data is FIRMetadata {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid FIRMetadata: fir should be an object");
  }

  const dataObject = data;

  if (!("firName" in dataObject) || !("firLabel" in dataObject)) {
    throw new Error(
      "Invalid FIRMetadata: fir must contain firName and firLabel"
    );
  }

  return true;
}

function isSectors(data: unknown): data is Sectors {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid Sectors: sectors should be an object");
  }

  const dataObject = data as { [k: string]: unknown };

  for (const key in dataObject) {
    if (typeof dataObject[key] !== "string") {
      throw new Error("Invalid Sectors: all sector values should be strings");
    }
  }

  return true;
}

function isVolume(data: unknown): data is Volume {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid Volume: volume should be an object");
  }

  const dataObject = data as { [k: string]: unknown };

  if (
    !("labelLocation" in dataObject) ||
    !Array.isArray(dataObject.labelLocation) ||
    dataObject.labelLocation.length !== 2 ||
    !dataObject.labelLocation.every((x) => typeof x === "number")
  ) {
    throw new Error("Invalid Volume: labelLocation is not valid");
  }

  if (!("ownership" in dataObject) || !isOwnership(dataObject.ownership)) {
    throw new Error("Invalid Volume: ownership is not valid");
  }

  if (!("geojson" in dataObject) || !isGeojson(dataObject.geojson)) {
    throw new Error("Invalid Volume: geojson is not valid");
  }

  return true;
}

function isOwnership(data: unknown): data is Ownership {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid Ownership: ownership should be an object");
  }

  const dataObject = data as { [k: string]: unknown };

  for (const key in dataObject) {
    if (
      !Array.isArray(dataObject[key]) ||
      !(dataObject[key] as unknown[]).every(
        (x) =>
          Array.isArray(x) &&
          x.length === 2 &&
          x.every((y) => typeof y === "number")
      )
    ) {
      throw new Error(
        "Invalid Ownership: all ownership values should be array of AltitudeRange"
      );
    }
  }

  return true;
}

function isGeojson(data: unknown): data is Geojson {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid Geojson: geojson should be an object");
  }

  const dataObject = data as { [k: string]: unknown };

  if (
    dataObject.type !== "Feature" ||
    !("geometry" in dataObject) ||
    !isGeometry(dataObject.geometry)
  ) {
    throw new Error("Invalid Geojson: geojson is not valid");
  }

  return true;
}

function isGeometry(
  data: unknown
): data is { coordinates: number[][][]; type: "Polygon" } {
  if (typeof data !== "object" || data === null) {
    throw new Error("Invalid Geometry: geometry should be an object");
  }

  const dataObject = data as { [k: string]: unknown };

  if (
    dataObject.type !== "Polygon" ||
    !("coordinates" in dataObject) ||
    !Array.isArray(dataObject.coordinates)
  ) {
    throw new Error("Invalid Geometry: coordinates is not valid");
  }

  return true;
}

export function parseFacilityData(data: unknown): FacilityData {
  // If data is a string, attempt to convert it into a JSON object
  if (typeof data === "string") {
    try {
      data = JSON.parse(data);
    } catch (e) {
      throw new Error("Data provided is not a valid JSON string");
    }
  }
  if (!isFacilityData(data)) {
    throw new Error("Data provided is not a valid FacilityData");
  }

  return data;
}
