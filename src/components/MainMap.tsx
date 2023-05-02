import React from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  AttributionControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";

// NOTE: Had to manually modify /node_modules/react-leaflet/lib/MapContainer.d.ts
// to add types  "center: number[];", "zoom: number;", and "attributionControl?: boolean;" to the MapContainerProps
// interface. Seems like extension of MapOptions doesn't work or?...
// Also had to add "attribution: string;" to TileLayerProps in easy-flash/node_modules/react-leaflet/lib/TileLayer.d.ts
// https://github.com/PaulLeCam/react-leaflet/issues/1070

const MainMap = () => {
  // const northAmericaPolygon: LatLngExpression[] = [
  //   [83.107577, -168.992188],
  //   [83.107577, -55.195312],
  //   [12.039321, -55.195312],
  //   [12.039321, -168.992188],
  // ];
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
        <Polygon pathOptions={{ color: "blue" }} positions={floridaPolygon} />
      </MapContainer>
    </div>
  );
};

export default MainMap;
