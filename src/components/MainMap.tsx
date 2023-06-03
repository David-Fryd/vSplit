import React from "react";
import {
  MapContainer,
  TileLayer,
  AttributionControl,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import type { FacilityCollection, FacilityImproved } from "~/types/facilityData";
import { renderPolygons } from "~/utils/mapDisplay/renderPolygons";
import LoadingIcon from "./LoadingIcon";
import _ from "lodash";

// const MainMap: React.FC<MainMapProps> = ({ sectorsWithVolumes }) => {
const MainMap = () => {
  const [allFacilityData, setAllFacilityData] = React.useState<FacilityImproved[]>(
    []
  );
  const [loading, setLoading] = React.useState<boolean>(true);
  const [loadingText, setLoadingText] = React.useState<string>(
    "Loading facility data files"
  );
  // const [errorText, setErrorText] = React.useState<string | null>(null);
  const fetchFacilityData = async () => {
    setLoadingText('Loading facility data...');
    const facilityList: FacilityImproved[] = [];
    const response = await fetch('/facilityData/~allFacilities.json');
    if (response.ok) {
      const rawData = await response.text();
      const jsonData = JSON.parse(rawData) as FacilityCollection;
      facilityList.push(...jsonData.facilities);
      setLoadingText('Facility data loaded.');
    } else {
      console.error(`Failed to load facility data: ${response.statusText}`);

      return null;
    }

    setAllFacilityData(facilityList);
    setLoading(false);
    setLoadingText("");
  };

  // TODO: This seems to run repeatedly... investigate me!
  // Fetch facility data when component is mounted
  React.useEffect(() => {
    console.log('Fetching new facility data');
    if (true) {
      fetchFacilityData().catch((error) => {
        console.error("Error fetching facility data", error);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

        {allFacilityData && renderPolygons(allFacilityData)}

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
