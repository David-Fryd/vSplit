import * as fs from "fs";

function computeCentroid(coordinates: number[][]): number[] {
  let minX = Infinity,
    minY = Infinity;
  let maxX = -Infinity,
    maxY = -Infinity;

  for (const coord of coordinates) {
    minX = Math.min(minX, coord[0]);
    maxX = Math.max(maxX, coord[0]);
    minY = Math.min(minY, coord[1]);
    maxY = Math.max(maxY, coord[1]);
  }

  return [(minX + maxX) / 2, (minY + maxY) / 2];
}

function parseOwnership(
  properties: Record<string, string>
): Record<string, [number, number]> {
  const ownership: Record<string, [number, number]> = {};
  for (const key in properties) {
    const ranges = properties[key].split("-");
    ownership[key] = [parseInt(ranges[0]), parseInt(ranges[1])];
  }
  return ownership;
}

/**
 * Given a .geojson FeatureCollection constructed using geojson.io and the ownership-by-properties
 * method (TODO: documented by EQ), converts it to the datatype the map uses to parse sector data.
 */
function convertToCustomSectorDatatype(featurecollection: string) {
  // Load the original data
  const data = JSON.parse(fs.readFileSync("data.geojson", "utf8"));

  // Transform the data
  let newData: any[] = [];
  let ownershipKeys: Set<string> = new Set();
  for (let feature of data["features"]) {
    // Compute the centroid of the bounding box for the feature
    const labelLocation = computeCentroid(
      feature["geometry"]["coordinates"][0]
    );

    // Parse the 'properties' object into the 'ownership' format
    const ownership = parseOwnership(feature["properties"]);

    // collect all the ownership keys
    for (let key in ownership) {
      ownershipKeys.add(key);
    }

    // After parsing ownership, features stripped of redundant info
    delete feature["properties"];

    // Create the new object
    const newObject = {
      labelLocation: labelLocation,
      ownership: ownership,
      geojson: feature,
    };

    // Append the new object to the new data
    newData.push(newObject);
  }

  // Mapping ownership keys to labels and sort the keys
  let ownershipWithLabels: Record<string, string> = {};
  let sortedKeys = Array.from(ownershipKeys).sort();
  for (let key of sortedKeys) {
    ownershipWithLabels[key] = `Sector ${key} Label`;
  }

  // Add the list of ownership keys and their labels as the first element in the new data
  newData.unshift({ sectors: ownershipWithLabels });

  // Save the transformed data
  fs.writeFileSync("new_data.json", JSON.stringify(newData, null, 2));
}
