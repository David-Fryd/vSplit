import {
  MapContainer,
  TileLayer,
  Polygon,
  AttributionControl,
  SVGOverlay,
  Tooltip,
} from "react-leaflet";
import { FacilityData, Volume } from "~/types/facilityData";
import type { LatLngExpression } from "leaflet";

const coordinatesToLatLngExpression = (
  coordinates: number[][][]
): LatLngExpression[][] => {
  return coordinates.map((ring) =>
    ring.map((coord) => [coord[1], coord[0]] as LatLngExpression)
  );
};

export const renderPolygons = (
  allFacilityData: FacilityData[],
  allGroupData: unknown[]
) => {
  return allFacilityData.flatMap((facilityData: FacilityData, i) => {
    return facilityData.volumes.map((volume: Volume, j) => {
      // The coordinates are nested arrays. The outer-most array can have multiple "parts" or "rings".
      // Here we're taking only the first part, which is the main outer boundary of the polygon.
      // If your polygons have holes in them, you would need to account for that here.
      const positions = coordinatesToLatLngExpression(
        volume.geojson.geometry.coordinates
      );
      return (
        <Polygon
          key={`polygon-${i}-${j}`}
          positions={positions}
          color="green"
          fillOpacity={0.5}
        >
          <Tooltip className="myCSSClass">
            <div className=" border-2 border-white bg-neutral-700 p-2 text-white">
              <p className="text-md font-bold">{`Test Text`}</p>
              {`Volume ${j} of ${facilityData.fir.firName}`}
            </div>
          </Tooltip>
        </Polygon>
      );
    });
  });
};
