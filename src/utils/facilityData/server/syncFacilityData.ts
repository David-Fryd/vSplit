// UTILITY CLASS RUN ON THE SERVER INVOKED BY PROTECTED PROCEDURE
// THAT SYNCS DATABASE FIR DATA WITH THE FACILITY DATA IN THE PUBLIC DIRECTORY

import { parseFacilityData } from "../parseFacilityData";
import type { FacilityCollection, FacilityImproved, FacilityRaw } from "~/types/facilityData";

import fsRegular from 'fs';
import fs from "fs/promises";
import path from "path";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
import assert from "assert";
import _ from "lodash";

export type SyncFacilityDataReturn = {
  firs: { firName: string; syncMessages: string[] }[];
  error: string | null;
};

export async function syncFacilityData({
  ctx,
}: {
  ctx: {
    session: Session | null;
    prisma: PrismaClient<
      Prisma.PrismaClientOptions,
      never,
      Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
    >;
  };
}) {
  const directoryPath = path.join(process.cwd(), "public", "facilityData");

  // List all files in the directory
  let files = await fs.readdir(directoryPath);
  files = _.without(files, '~allFacilities.json');

  // Keep track of the FIR names we've already encountered
  // firName -> file name it was seen in (for error message purposes)
  const seenFirNames: { [key: string]: string } = {};

  // In the future we could improve this structure to be more granular in the types of info it returns
  // i.e. returnMessage.firs[0] = {firName: "ZMA", syncMessages: ["Sector 46 was added to DB","..."]}
  const returnMessage: SyncFacilityDataReturn = {
    firs: [],
    error: null,
  };

  const dataPromises = files.map(async (file) => {
    const filePath = path.join(directoryPath, file);
    const rawData: unknown = JSON.parse(await fs.readFile(filePath, "utf-8"));
    const facilityDataFromFile = parseFacilityData(rawData);

    if (facilityDataFromFile.fir.firName in seenFirNames) {
      const seenFirName = facilityDataFromFile.fir.firName;
      const otherSeenFileName = seenFirNames[seenFirName];
      assert(otherSeenFileName !== undefined);
      returnMessage.error = `Duplicate FIR name encountered: FIR ${facilityDataFromFile.fir.firName} is defined in both 'public/${file}' and 'public/${otherSeenFileName}'`;
      return returnMessage;
    } else {
      seenFirNames[facilityDataFromFile.fir.firName] = file;
      console.log("syncing ", facilityDataFromFile.fir.firName);

      const facilityDataFromDB = await ctx.prisma.fIR.findFirst({
        where: {
          firName: facilityDataFromFile.fir.firName,
        },
        include: {
          sectors: true,
        },
      });

      // FIR DOESNT ALREADY EXIST IN DB
      if (facilityDataFromDB === null) {
        console.log(
          `FIR ${facilityDataFromFile.fir.firName} doesn't exist in DB, creating it`
        );
        const fir = await ctx.prisma.fIR.create({
          data: {
            firName: facilityDataFromFile.fir.firName,
            firLabel: facilityDataFromFile.fir.firLabel,
            sectors: {},
          },
        });
        returnMessage.firs.push({
          firName: fir.firName,
          syncMessages: ["FIR created in database"],
        });
      }
      // Sync FIR Label
      else if (
        facilityDataFromDB.firLabel !== facilityDataFromFile.fir.firLabel
      ) {
        console.log(
          `FIR ${facilityDataFromFile.fir.firName} label changed from ${facilityDataFromDB.firLabel} to ${facilityDataFromFile.fir.firLabel}`
        );
        const fir = await ctx.prisma.fIR.update({
          where: {
            firName: facilityDataFromFile.fir.firName,
          },
          data: {
            firLabel: facilityDataFromFile.fir.firLabel,
          },
        });
        returnMessage.firs.push({
          firName: fir.firName,
          syncMessages: [
            `FIR label changed from ${facilityDataFromDB.firLabel} to ${facilityDataFromFile.fir.firLabel}`,
          ],
        });
      }

      // NOTE: Remove Unused FIRs from DB (currently this is done manually for safety, and we just are careful about
      // allowing pull requests with FIR names that shouldn't change often...)

      // UPDATE SECTORS
      for (const sectorIDFile of Object.keys(facilityDataFromFile.sectors)) {
        const sectorLabel = facilityDataFromFile.sectors[sectorIDFile];
        assert(sectorLabel !== undefined);
        const sectorFromDB = facilityDataFromDB?.sectors.find(
          (sector) => sector.sectorID === sectorIDFile
        );

        // console.log(
        //   "comparing sector",
        //   sectorFromDB,
        //   "to",
        //   sectorIDFile,
        //   sectorLabel
        // );

        if (sectorFromDB === undefined) {
          // Sector doesn't exist in DB, create it
          const sectorLabel = facilityDataFromFile.sectors[sectorIDFile];
          assert(sectorLabel !== undefined);
          const sector = await ctx.prisma.sector.create({
            data: {
              sectorID: sectorIDFile,
              sectorLabel: sectorLabel,
              firName: facilityDataFromFile.fir.firName,
              notes: "",
            },
          });
          const currFirIndex = returnMessage.firs.length - 1;
          returnMessage.firs[currFirIndex]?.syncMessages.push(
            `Sector ${sector.sectorID} ${sector.sectorLabel} created in database`
          );
        } else {
          // Potentially update it
          // We DON'T use usert because we want to log what was changed in a message and usert doesnt give us that
          if (sectorFromDB.sectorLabel !== sectorLabel) {
            const OldLabel = sectorFromDB.sectorLabel;

            console.log("returnMessage.firs", returnMessage.firs);
            if (returnMessage.firs.length == 0) {
              returnMessage.firs.push({
                firName: facilityDataFromFile.fir.firName,
                syncMessages: [],
              });
            }
            const currFirIndex = returnMessage.firs.length - 1;

            console.log("returnMessage.firs", returnMessage.firs);
            console.log("SHOULD BE PUSHING SOMETHING HERE");

            const sector = await ctx.prisma.sector.update({
              where: {
                uniqueSectorID: sectorFromDB.uniqueSectorID,
              },
              data: {
                sectorLabel: sectorLabel,
              },
            });

            returnMessage.firs[currFirIndex]?.syncMessages.push(
              `Sector ${sector.sectorID} label updated from '${OldLabel}' to '${sector.sectorLabel}'`
            );
          }
        }
      }

      // Remove sectors that are in the DB but not in the file
      const sectorIDsFromFile = Object.keys(facilityDataFromFile.sectors);
      const sectorsFromDB = facilityDataFromDB?.sectors || [];

      for (const sectorFromDB of sectorsFromDB) {
        if (!sectorIDsFromFile.includes(sectorFromDB.sectorID)) {
          await ctx.prisma.sector.delete({
            where: {
              uniqueSectorID: sectorFromDB.uniqueSectorID,
            },
          });
          if (returnMessage.firs.length == 0) {
            returnMessage.firs.push({
              firName: facilityDataFromFile.fir.firName,
              syncMessages: [],
            });
          }

          const currFirIndex = returnMessage.firs.length - 1;
          returnMessage.firs[currFirIndex]?.syncMessages.push(
            `Sector ${sectorFromDB.sectorID} ${sectorFromDB.sectorLabel} removed from database`
          );
        }
      }

      // console.log("facilityDataFromDB", facilityDataFromDB?.sectors);
      // console.log("facilityDataFromFile", facilityDataFromFile.sectors);
    }
  });

  await Promise.all(dataPromises);

  // TODO: Don't overwrite the file if there are no changes (other than timestamp)
  // Generate comprehensive facilities file, and save it in public folder
  const facilityCollection: FacilityCollection = {
    timestamp: Date.now(),
    facilities: []
  };
  const filePaths = files.map(filename => path.join(directoryPath, filename));

  // Reformat all of the source data files to the desired format, and add to the FacilityCollection
  for (const filePath of filePaths) {
    const fileContent = fsRegular.readFileSync(filePath, 'utf8');
    const facilityRawJson = JSON.parse(fileContent) as FacilityRaw;
    const index = facilityCollection.facilities.length + 1;
    const facility: FacilityImproved = {
      firDetails: {
        // TODO: The names in the FIR db table are misleading... improve them!
        id: index + 1,
        lid: facilityRawJson.fir.firName,
        fullName: facilityRawJson.fir.firLabel
      },
      sectorNames: facilityRawJson.sectors,
      airspaceVolumes: facilityRawJson.volumes
    };

    facilityCollection.facilities.push(facility);
  }

  // Assemble the comprehensive facility file
  const comprehensiveFacilityFileName = '~allFacilities.json';
  const comprehensiveFacilityFilePath = path.join(directoryPath, comprehensiveFacilityFileName);
  const comprehensiveFacilityFileText = JSON.stringify(facilityCollection);
  const currentFileRawText = fsRegular.readFileSync(comprehensiveFacilityFilePath, 'utf8');
  const currentFileFacilityCollection = JSON.parse(currentFileRawText) as FacilityCollection;
  const nextFileFacilityCollection = facilityCollection;
  
  // Apply changes only if the proposed data differs from the current
  if (!_.isEqual(currentFileFacilityCollection.facilities, nextFileFacilityCollection.facilities)) {
    // Write the comprehensive facility file
    fsRegular.writeFileSync(comprehensiveFacilityFilePath, comprehensiveFacilityFileText);
  
    // Update the facility dataset timestamp in the database
    await ctx.prisma.timestamps.update({
      where: {
        name: 'facilityDatasetTimestamp'
      },
      data: {
        value: facilityCollection.timestamp
        // value: 0
      }
    });
  }

  return returnMessage;
}
