// Each facility will provide a .json file of the following format:
export type FacilityData = {
  sectors: Sectors;
  volumes: Volume[];
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

export type Volume = {
  labelLocation: [number, number];
  ownership: Ownership;
  geojson: Geojson;
};

export type Sectors = {
  [sectorId: string]: string;
};
