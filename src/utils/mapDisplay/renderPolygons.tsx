import { Polygon, Tooltip, SVGOverlay } from "react-leaflet";
import type { AltitudeRange, FacilityData, Volume } from "~/types/facilityData";
import type {
  LatLngExpression,
  LatLngTuple,
  LatLngBoundsExpression,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../api";
import assert from "assert";

const coordinatesToLatLngExpression = (
  coordinates: number[][][]
): LatLngExpression[][] => {
  return coordinates.map((ring) =>
    ring.map((coord) => [coord[1], coord[0]] as LatLngExpression)
  );
};

const calculateBounds = (
  coordinates: LatLngExpression[][]
): LatLngBoundsExpression => {
  let minLat = Infinity;
  let maxLat = -Infinity;
  let minLng = Infinity;
  let maxLng = -Infinity;

  coordinates.forEach((ring) => {
    ring.forEach((coord: LatLngExpression) => {
      const coordArr = coord as [number, number]; // Assertion that coord is an array
      minLat = Math.min(minLat, coordArr[0]);
      maxLat = Math.max(maxLat, coordArr[0]);
      minLng = Math.min(minLng, coordArr[1]);
      maxLng = Math.max(maxLng, coordArr[1]);
    });
  });

  return [
    [minLat, minLng],
    [maxLat, maxLng],
  ];
};

export const renderPolygons = (
  allFacilityData: FacilityData[],
  allGroupData: unknown[]
) => {
  const groupings = api.facilitydata.getFIRsWithGroups.useQuery();
  console.log("GROUPINGS FROM DB: ", groupings.data);

  return allFacilityData.flatMap((facilityData: FacilityData, i) => {
    const currFacilityGrouping = groupings.data?.find(
      (grouping) => grouping.firName === facilityData.fir.firName
    );
    console.log(
      "currently considering facility w groupings: ",
      currFacilityGrouping
    );

    return facilityData.volumes.map((volume: Volume, j) => {
      if (currFacilityGrouping === undefined) {
        return null;
        // Don't render anything on the map if the groups haven't loaded yet
        // Or maybe just render the default white polygons?
        //TODO ^^^
      }

      type SectorDisplayInfo = {
        sectorID: string;
        sectorLabel: string;
        altitudeRange: AltitudeRange | undefined;
        groupName: string | null;
        groupColor: string;
      };
      type DisplayInfo = {
        [sectorID: string]: SectorDisplayInfo[];
      };

      const displayInfo: DisplayInfo = {};

      // Determine display properties based on groupings
      // For every ownership key, find and retrieve that data from the currFacilityGrouping
      for (const [key, value] of Object.entries(volume.ownership)) {
        // console.log("key (sector ownership id): ", key);
        // Find the sector among currFacilityGroping.sectors whose sectorID matches the key
        const sector = currFacilityGrouping.sectors.find(
          (sector) => sector.sectorID === key
        );
        if (sector === undefined) {
          console.log(`sector is undefined for key ${key}`);
          return null;
        }

        // console.log(
        //   `examining ownership key ${key} of volume that has ownership ${JSON.stringify(
        //     volume.ownership
        //   )}, found sector: `,
        //   sector
        // );
        assert(sector !== undefined, "sector should not be undefined");

        const newDisplayInfo = {
          sectorID: key,
          sectorLabel: sector.sectorLabel,
          altitudeRange: value ? value[0] : undefined,
          groupName: sector.group ? sector.group.groupName : null,
          // TODO: This shouldn't be necessary!! vvv
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
          groupColor: sector.group ? sector.group.groupColor : "#aaa",
        };

        if (displayInfo[key]) {
          const array = displayInfo[key];
          assert(array !== undefined, "array should not be undefined");
          array.push(newDisplayInfo);
          console.log("pushed");
        } else {
          displayInfo[key] = [newDisplayInfo];
          console.log("elsed");
        }
      }

      // Number of unique groups for a given volume w/ will determine the color/dashing of the polygon/boundaries
      const uniqueGroupsInfo: {
        groupName: string | "NO_GROUP_ASSIGNED";
        groupColor: string;
      }[] = [];
      for (const [key, value] of Object.entries(displayInfo)) {
        console.log("examining key for unique groups: ", key);

        value.forEach((sectorInfo) => {
          if (
            !uniqueGroupsInfo.find(
              (groupInfo) => groupInfo.groupName === sectorInfo.groupName
            )
          ) {
            uniqueGroupsInfo.push({
              groupName: sectorInfo.groupName
                ? sectorInfo.groupName
                : "NO_GROUP_ASSIGNED",
              groupColor: sectorInfo.groupColor,
            });
          }
        });
      }

      if (uniqueGroupsInfo.length !== 0) {
        console.log(
          `this given volume has ${
            uniqueGroupsInfo.length
          } groups (${JSON.stringify(uniqueGroupsInfo)})`
        );
      }

      const positions = coordinatesToLatLngExpression(
        volume.geojson.geometry.coordinates
      );

      const bounds = calculateBounds(positions);

      const fillColor = uniqueGroupsInfo[0]?.groupColor;

      return (
        <div key={`polygon-${i}-${j}`}>
          <Polygon
            positions={positions}
            color={fillColor}
            fillOpacity={0.1}
            pathOptions={{
              // color: "red",
              weight: 1,
              dashArray: "5, 5",
              dashOffset: "0",
            }}
          >
            <Tooltip className="myCSSClass">
              <div className=" border-2 border-white bg-neutral-700 p-2 text-white">
                <p className="text-md font-bold">{`Test Text`}</p>
                {`Volume ${j} of ${facilityData.fir.firLabel} (${facilityData.fir.firName})`}
              </div>
            </Tooltip>
          </Polygon>
          {/* TODO add additional transparent polygons with dasharray/dashoffset of differnent colors to indicate combined sectors */}
          <SVGOverlay bounds={bounds}>
            <text x="50%" y="50%" className="flex flex-col" stroke="">
              {/* Instead of what we have below, use displayInfo to map */}
              {Object.entries(displayInfo).map(([sectorID, displayInfos]) =>
                displayInfos.map((displayInfo) => (
                  <tspan
                    className="font-mono font-bold"
                    style={{ fill: displayInfo.groupColor }}
                    key={sectorID}
                    x="50%"
                    dy="1.3em"
                  >
                    {`${displayInfo.groupName || "N/A"}: ${
                      displayInfo.altitudeRange
                        ? `${displayInfo.altitudeRange[0]}-${displayInfo.altitudeRange[1]}`
                        : "N/A"
                    }`}
                  </tspan>
                ))
              )}
              {/* {Object.entries(volume.ownership).map(([key, value]) => (
                <tspan
                  className="fill-white font-mono font-bold"
                  key={key}
                  x="50%"
                  dy="1.3em"
                >
                  
                  Currently just shows first layer of ownership for a given sector assignment. 
                  TODO: Show other layers of of ownership for a given sector owner, if applicable 
                  
                  {key}: {value[0] ? `${value[0][0]}-${value[0][1]}` : "N/A"}
                </tspan>
              ))} */}
            </text>
          </SVGOverlay>
        </div>
      );
    });
  });
};
