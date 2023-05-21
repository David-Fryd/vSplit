import { Polygon, Tooltip, SVGOverlay } from "react-leaflet";
import type { FacilityData, Volume } from "~/types/facilityData";
import type {
  LatLngExpression,
  LatLngTuple,
  LatLngBoundsExpression,
} from "leaflet";
import "leaflet/dist/leaflet.css";

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
  return allFacilityData.flatMap((facilityData: FacilityData, i) => {
    return facilityData.volumes.map((volume: Volume, j) => {
      const ownership = volume.ownership;
      console.log("ownership", ownership);

      const positions = coordinatesToLatLngExpression(
        volume.geojson.geometry.coordinates
      );

      const bounds = calculateBounds(positions);

      return (
        <div key={`polygon-${i}-${j}`}>
          <Polygon positions={positions} color="white" fillOpacity={0.3}>
            <Tooltip className="myCSSClass">
              <div className=" border-2 border-white bg-neutral-700 p-2 text-white">
                <p className="text-md font-bold">{`Test Text`}</p>
                {`Volume ${j} of ${facilityData.fir.firLabel} (${facilityData.fir.firName})`}
              </div>
            </Tooltip>
          </Polygon>
          <SVGOverlay bounds={bounds}>
            <text x="50%" y="50%" stroke="white">
              {Object.entries(ownership).map(([key, value]) => (
                <tspan
                  className="font-mono text-red-500"
                  key={key}
                  x="50%"
                  dy="1.2em"
                >
                  {key}: {value}
                </tspan>
              ))}
            </text>
          </SVGOverlay>
        </div>
      );
    });
  });
};
