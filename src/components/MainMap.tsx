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
import type { FacilityData } from "~/types/facilityData";
import { renderPolygons } from "~/utils/mapDisplay/renderPolygons";
import LoadingIcon from "./LoadingIcon";

// const MainMap: React.FC<MainMapProps> = ({ sectorsWithVolumes }) => {
const MainMap = () => {
  // Re-request even on tab in/out
  // const firData = api.facilitydata.getFIRsWithSectors.useQuery();
  // TODO: Implement, and inform how groups are drawn etc...
  // const groups = api.facilitydata.getFIRsWithGroups.useQuery();

  const [allFacilityData, setAllFacilityData] = React.useState<FacilityData[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(true);

  const filesInPublicFolder =
    api.facilitydata.getFacilityDataFilenames.useQuery();

  const fetchFacilityData = async () => {
    const facilityDataArray: FacilityData[] = [];
    for (const file of filesInPublicFolder.data ?? []) {
      console.log("getting facility data from file:", file);
      const response = await fetch(`/facilityData/${file}`);
      if (response.ok) {
        const rawData = await response.text();
        const facilityData = parseFacilityData(rawData);
        console.log("GOT FACILITY DATA:", facilityData);
        facilityDataArray.push(facilityData);
      } else {
        console.error(
          `Failed to fetch facility data from ${file}: ${response.statusText}`
        );
        return null;
      }
    }
    setAllFacilityData(facilityDataArray);
    setLoading(false);
  };

  // Fetch facility data when component is mounted
  React.useEffect(() => {
    if (filesInPublicFolder.data) {
      fetchFacilityData().catch((error) => {
        console.error("Error fetching facility data", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesInPublicFolder.data]);

  console.log("allFacilityData", allFacilityData);

  return (
    <div className="relative h-full w-full">
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

        {allFacilityData && renderPolygons(allFacilityData, [])}
      </MapContainer>
      {loading && (
        <div className="absolute left-0 top-0 flex h-full w-full items-center justify-center bg-neutral-900 bg-opacity-50">
          <div className="text-2xl text-white">Loading Facility Data...</div>
          <LoadingIcon />
        </div>
      )}
    </div>
  );
};

export default MainMap;
