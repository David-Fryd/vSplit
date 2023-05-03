import React from "react";
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

// type VolumePolygon = {
//   bounds: LatLngExpression[];
// };

// interface MainMapProps {
//   sectorsWithVolumes: VolumePolygon;
// }

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
  const sectorData = api.facilitydata.getAllSectorWithVolumes.useQuery();

  // Ultimately get the FeatureCollection as a typed GeoJSON JSON object

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
        <Polygon
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
        />
      </MapContainer>
    </div>
  );
};

export default MainMap;
