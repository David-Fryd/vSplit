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
import _ from "lodash";

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
  const [loadingText, setLoadingText] = React.useState<string>(
    "Loading facility data files"
  );
  const [errorText, setErrorText] = React.useState<string | null>(null);

  // TODO: Don't get the file names from the API, request the minified data file from the api
  //   - this means the server will have to generate this ahead of time. maybe one file by combining all the
  //     public folder data, and one JSON object formed from the database state to send sector combination info
  const allFilesInPublicFolder = api.facilitydata.getFacilityDataFilenames.useQuery();
  const facilityFilesInPublicFolder = _.without(allFilesInPublicFolder.data,'~allFacilities.json');

  const fetchFacilityData = async () => {
    const facilityDataArray: FacilityData[] = [];
    for (const file of facilityFilesInPublicFolder ?? []) {
      // console.log("getting facility data from file:", file);
      setLoadingText(`Loading facility data from ${file}`);
      const response = await fetch(`/facilityData/${file}`);
      if (response.ok) {
        const rawData = await response.text();
        const facilityData = parseFacilityData(rawData);
        // console.log("GOT FACILITY DATA:", facilityData);
        facilityDataArray.push(facilityData);
        setLoadingText(`Loaded ${facilityData.fir.firName} facility data`);
      } else {
        console.error(
          `Failed to fetch facility data from ${file}: ${response.statusText}`
        );
        return null;
      }
    }
    // if (facilityFilesInPublicFolder.error.data) {
    //   setErrorText(`Could not load files from public folder`);
    //   console.log(`setting error text to ${errorText ? errorText : ""}`);
    // }
    setAllFacilityData(facilityDataArray);
    setLoading(false);
    setLoadingText("");
  };

  // Fetch facility data when component is mounted
  React.useEffect(() => {
    if (facilityFilesInPublicFolder) {
      fetchFacilityData().catch((error) => {
        console.error("Error fetching facility data", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allFilesInPublicFolder.data]);

  // console.log("allFacilityData", allFacilityData);

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={[25.8, -78.5]}
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

        {loading && (
          <div className="absolute left-0 top-0 z-[9999] flex h-full w-full flex-col items-center justify-center bg-black bg-opacity-50">
            <div className="pb-2 text-2xl text-white">
              Loading Facility Data...
            </div>
            <LoadingIcon />
            <p className="text-md pt-2 text-white">{loadingText}</p>
          </div>
        )}
      </MapContainer>
    </div>
  );
};

export default MainMap;
