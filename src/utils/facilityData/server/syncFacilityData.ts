// import { api } from "../api";
import { parseFacilityData } from "./parseFacilityData";
import type { FacilityData } from "~/types/facilityData";

import fs from "fs/promises";
import path from "path";

export async function syncFacilityData() {
  const directoryPath = path.join(process.cwd(), "public", "facilityData");

  // List all files in the directory
  const files = await fs.readdir(directoryPath);

  // Keep track of the FIR names we've already encountered
  const firNames = new Set<string>();

  const parsedData: FacilityData[] = [];

  const dataPromises = files.map(async (file) => {
    const filePath = path.join(directoryPath, file);
    const rawData: unknown = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const facilityData = parseFacilityData(rawData);

    if (firNames.has(facilityData.fir.firName)) {
      throw new Error(
        `Duplicate FIR name encountered: ${facilityData.fir.firName}`
      );
    } else {
      console.log("syncing ", facilityData.fir.firName);
      firNames.add(facilityData.fir.firName);
      parsedData.push(facilityData);
    }
  });

  await Promise.all(dataPromises);

  console.log("parsed data!", parsedData);
  return parsedData; // return all parsed data if needed
}
