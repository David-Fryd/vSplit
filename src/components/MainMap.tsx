import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  AttributionControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { api } from "../utils/api";
import type { GeoJSON } from "leaflet";
import type { FacilityGeoJSON, FacilityFeature } from "~/types/facilityData";
import { parseFacilityGeoJSON } from "~/utils/parseFacilityGeoJSON";

// const testPolygon: VolumePolygon = {
//   "bounds": [
//     [83.107577, -168.992188],
//     [83.107577, -55.195312],
//     [12.039321, -55.195312],
//     [12.039321, -168.992188],
//   ],
// };

// const MainMap: React.FC<MainMapProps> = ({ sectorsWithVolumes }) => {
const MainMap = () => {
  // const sectorData = api.facilitydata.getAllSectorWithVolumes.useQuery();

  // Ultimately get the FeatureCollection as a typed GeoJSON JSON object

  // Iterate through each facility GeoJSON: (every FIR has the name of its associated sector file hosted in the public directory)

  // - For each Feature, examine properties
  // - Draw polygon differently depending on whether one (or more) of the associated sector keys is in an active group

  // Get the GeoJSON for the zmaSector under the /public folder
  const [zmaSectorGeoJSON, setZmaSectorGeoJSON] =
    React.useState<FacilityGeoJSON>();
  const fetchZmaSectorGeoJSON = async () => {
    try {
      const response = await fetch("/facilityData/zmaSectors.geojson");
      if (response.ok) {
        const rawData = await response.text();
        const geojsonData = parseFacilityGeoJSON(rawData);
        setZmaSectorGeoJSON(geojsonData);
      } else {
        console.error(
          "Failed to fetch zmaSectors.geojson:",
          response.statusText
        );
      }
    } catch (error) {
      console.error("Error fetching zmaSectors.geojson:", error);
    }
  };

  useEffect(() => {
    fetchZmaSectorGeoJSON().catch((error) => {
      console.error("Error fetching zmaSectors.geojson:", error);
    });
  }, []);

  const coordinatesToLatLngExpression = (
    coordinates: number[][][]
  ): LatLngExpression[][] => {
    return coordinates.map((ring) =>
      ring.map((coord) => [coord[1], coord[0]] as LatLngExpression)
    );
  };

  const renderPolygons = (features: FacilityFeature[]) => {
    return features.map((feature, index) => {
      const positions = coordinatesToLatLngExpression(
        feature.geometry.coordinates
      );

      return (
        <Polygon
          key={index}
          pathOptions={{ color: "blue", weight: 1, dashArray: "5, 5, 5, 2" }}
          positions={positions}
        />
      );
    });
  };

  // Florida polygon
  const floridaPolygon: LatLngExpression[] = [
    [31.707015, -87.890625],
    [31.707015, -79.804688],
    [24.527135, -79.804688],
    [24.527135, -87.890625],
  ];

  console.log("main map re-render");
  return (
    <div className="h-full w-full">
      {/* <p className=" bg-neutral-500 text-white">
        {zmaSectorGeoJSON && (JSON.stringify(zmaSectorGeoJSON) as any)}
      </p> */}
      <MapContainer
        center={[35.8283, -98.5795]}
        zoom={4.5}
        style={{ height: "100%", width: "100%", backgroundColor: "#222" }}
        attributionControl={false}
      >
        <AttributionControl position="topright" />
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* <Polygon
          pathOptions={{ color: "blue", weight: 1, dashArray: "20, 20" }}
          positions={floridaPolygon}
        />
        <Polygon
          pathOptions={{
            color: "red",
            weight: 1,
            dashArray: "20, 20",
            dashOffset: "20",
          }}
          positions={floridaPolygon}
        /> */}
        {zmaSectorGeoJSON && renderPolygons(zmaSectorGeoJSON.features)}
      </MapContainer>
    </div>
  );
};

export default MainMap;
