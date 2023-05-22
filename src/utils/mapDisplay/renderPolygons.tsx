import { Polygon, Polyline, Tooltip, SVGOverlay, Marker } from "react-leaflet";
import type { AltitudeRange, FacilityData, Volume } from "~/types/facilityData";
import type {
  LatLngExpression,
  LatLngTuple,
  LatLngBoundsExpression,
} from "leaflet";
import "leaflet/dist/leaflet.css";
import { api } from "../api";
import assert from "assert";
import { averageHexFromGroupcolors } from "./colorUtils";
import L from "leaflet";
import { renderToString } from "react-dom/server";

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

export type GroupInfo = {
  groupName: string | null;
  groupColor: string;
  groupFrequency: string | null;
};

function parseAltitudeRange(altRange: AltitudeRange): string {
  const start = altRange[0];
  const end = altRange[1];

  if (start === 0 && end === 999) {
    return "ALL";
  } else {
    return `${altRange[0].toString().padStart(3, "0")}-${altRange[1]}`;
  }
}

type SectorDisplayInfo = {
  sectorID: string;
  sectorLabel: string;
  altitudeRange: AltitudeRange | undefined;
} & GroupInfo;
type DisplayInfo = {
  [sectorID: string]: SectorDisplayInfo[];
};

function DisplayInfoComponent({ displayInfo }: { displayInfo: DisplayInfo }) {
  return (
    <div>
      {/* Red marker is approx the center of where this is rendered */}
      {/* <div className="absolute h-1 w-1 bg-red-500"></div> */}
      <div
        className=" flex flex-col gap-y-0 whitespace-nowrap font-mono"
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          pointerEvents: "none",
        }}
        // pointerEvents: none so that tooltip doesn't dissapear for the polygon when blocked by the background of this div
      >
        {Object.entries(displayInfo).flatMap(([sectorID, displayInfos]) =>
          displayInfos.map((displayInfo: SectorDisplayInfo) => (
            <div
              className=" -mt-1.5 flex"
              key={displayInfo.sectorID}
              style={{ color: displayInfo.groupColor }}
            >
              {displayInfo.groupName || "N/A"}:{" "}
              {displayInfo.altitudeRange
                ? parseAltitudeRange(displayInfo.altitudeRange)
                : "N/A"}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

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
          groupColor: sector.group ? sector.group.groupColor : "#555",
          groupFrequency: sector.group ? sector.group.groupFrequency : null,
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
      const uniqueGroupsInfo: GroupInfo[] = [];
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
              groupFrequency: sectorInfo.groupFrequency,
            });
          }
        });
      }
      const fillOpacity = 0.2;
      // Used to color in the polygon based on the controlling groups
      // Iterate through each of the unique groups and average their groupColor's together
      const combinedGroupColor =
        averageHexFromGroupcolors(
          uniqueGroupsInfo
        ); /* TODO - Combine hex values as if they were overlaid transparently on one another */

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

      // const fillColor = uniqueGroupsInfo[0]?.groupColor;
      const fillColor = combinedGroupColor;

      const icon = L.divIcon({
        className: "my-div-icon",
        html: renderToString(
          <DisplayInfoComponent displayInfo={displayInfo} />
        ),
      });

      return (
        <div key={`polygon-${i}-${j}`} className="">
          <Marker
            position={[volume.labelLocation[1], volume.labelLocation[0]]}
            icon={icon}
          />
          <Polygon
            className="interactivepoly"
            positions={positions}
            color={fillColor}
            fillOpacity={fillOpacity}
            pathOptions={{
              color: fillColor,
              weight: 1,
              opacity: 0.7,
            }}
            eventHandlers={{
              click: (event) => {
                L.DomEvent.stop(event);
                console.log("clicked");
              },
            }}
          >
            <Tooltip className="myCSSClass" opacity={1}>
              <div className=" flex flex-col border-2  border-white bg-neutral-800 p-2 text-white">
                {Object.entries(displayInfo).flatMap(
                  ([sectorID, displayInfos]) =>
                    displayInfos.map((displayInfo: SectorDisplayInfo) => (
                      <div key={displayInfo.sectorID} className="px-1 pb-2">
                        <p
                          className="font-bold underline"
                          style={{ color: displayInfo.groupColor }}
                        >
                          {displayInfo.groupName || "N/A"} :{" "}
                          {displayInfo.sectorLabel}
                          {/* ({displayInfo.sectorID}) */}
                        </p>
                        <p
                          style={{ color: displayInfo.groupColor }}
                          className=""
                        >
                          ALTS:{" "}
                          <b>
                            {displayInfo.altitudeRange
                              ? parseAltitudeRange(displayInfo.altitudeRange)
                              : "N/A"}
                          </b>
                        </p>
                        <p style={{ color: displayInfo.groupColor }}>
                          FREQ: <b>{displayInfo.groupFrequency || "N/A"}</b>
                        </p>
                      </div>
                    ))
                )}
                <span className="mt-2 border-t-[1px] text-neutral-300">{`Volume ${j} of ${facilityData.fir.firLabel} (${facilityData.fir.firName})`}</span>
              </div>
            </Tooltip>
          </Polygon>
        </div>
      );
    });
  });
};
