import React, { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  AttributionControl,
  SVGOverlay,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { LatLngExpression } from "leaflet";
import { LatLngBounds } from "leaflet";
import { api } from "../utils/api";
import type { GeoJSON } from "leaflet";
import { parseFacilityData } from "~/utils/facilityData/parseFacilityData";
import { FacilityData } from "~/types/facilityData";

// const MainMap: React.FC<MainMapProps> = ({ sectorsWithVolumes }) => {
const MainMap = () => {
  // Re-request even on tab in/out
  // const firData = api.facilitydata.getFIRsWithSectors.useQuery();
  // TODO: Implement, and inform how groups are drawn etc...
  // const groups = api.facilitydata.getFIRsWithGroups.useQuery();

  const [allFacilityData, setAllFacilityData] =
    React.useState<FacilityData[]>();

  const fetchFacilityData = async () => {
    const filesInPublicFolder =
      api.facilitydata.getFacilityDataFilenames.useQuery();
    for (const file of filesInPublicFolder.data ?? []) {
      console.log("getting facility data from file:", file);
      const response = await fetch(`/facilityData/${file}`);
      if (response.ok) {
        const rawData = await response.text();
        const facilityData = parseFacilityData(rawData);
        console.log("GOT FACILITY DATA:", facilityData);

        // return facilityData;
      } else {
        console.error(
          `Failed to fetch facility data from ${file}: ${response.statusText}`
        );
        return null;
      }
    }
  };

  fetchFacilityData().catch((error) => {
    console.error("Error fetching facility data", error);
  });

  return (
    <div className="h-full w-full">
      <MapContainer
        center={[35.8283, -98.5795]}
        zoom={5}
        zoomSnap={0.5}
        style={{ height: "100%", width: "100%", backgroundColor: "#222" }}
        attributionControl={false}
      >
        <AttributionControl position="topright" />
        <TileLayer
          url="https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_nolabels/{z}/{x}/{y}{r}.png"
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        />
        {/* {allFacilityData?.map((facility) => {
          return renderPolygons(facility.features);
        })} */}
      </MapContainer>
    </div>
  );
};

export default MainMap;
