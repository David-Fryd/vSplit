// Each facility will provide a .json file of the following format:
export type FacilityData = {
  fir: FirDetails;
  sectors: SectorNameMap; // TODO: rename "sectors" to "sectorNames"
  volumes: AirspaceVolume[]; // TODO: rename "volumes" to "airspaceVolumes"
};

export type FirDetails = {
  firName: string; // TODO: rename me from "firName" to "lid" (for FAA LID, 'location id')
  firLabel: string; // TODO: rename me from "firLabel" to "fullName"
};

export type AltitudeRange = [number, number];

export type Ownership = {
  [sectorId: string]: AltitudeRange[];
};

export type Geojson = {
  type: "Feature";
  geometry: {
    coordinates: number[][][];
    type: "Polygon";
  };
  id: number;
};

export type AirspaceVolume = {
  labelLocation: [number, number];
  ownership: Ownership;
  geojson: Geojson;
};

export type SectorNameMap = {
  [sectorId: string]: string;
};

// the shape of `~allFacilities.json`
export interface FacilityCollection {
  timestamp: number,
  facilities: FacilityImproved[]
}

// TODO: Once everything is working, just use this format, and reformat the data files to match it.
// facility shape used in comprehensive facility file
export interface FacilityImproved {
  firDetails: {
    id: number, // TODO: Do we need this id field? Presumably not? Why did I put it there?
    lid: string,
    fullName: string
  },
  sectorNames: object,
  airspaceVolumes: AirspaceVolume[]
}

// TODO: Deprecate me in favor of FacilityImproved
// facility shape used in zmaSectors.json
export interface FacilityRaw {
  fir: {
    firName: string,
    firLabel: string
  },
  sectors: object,
  volumes: AirspaceVolume[]
}