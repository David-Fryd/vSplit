// UTILITY CLASS RUN ON THE SERVER INVOKED BY PROTECTED PROCEDURE
// THAT SYNCS DATABASE FIR DATA WITH THE FACILITY DATA IN THE PUBLIC DIRECTORY

import { parseFacilityData } from "../parseFacilityData";
import type { FacilityData } from "~/types/facilityData";

import fs from "fs/promises";
import path from "path";
import type { Prisma, PrismaClient } from "@prisma/client";
import type { Session } from "next-auth";
import assert from "assert";

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
  const files = await fs.readdir(directoryPath);

  // Keep track of the FIR names we've already encountered
  // firName -> file name it was seen in (for error message purposes)
  const seenFirNames: { [key: string]: string } = {};

  const parsedData: FacilityData[] = [];

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

        // for (const sectorIDFile of Object.keys(facilityDataFromFile.sectors)) {
        //   // Create the sector in the database
        //   const sectorLabel = facilityDataFromFile.sectors[sectorIDFile];
        //   assert(sectorLabel !== undefined);
        //   const sector = await ctx.prisma.sector.create({
        //     data: {
        //       sectorID: sectorIDFile,
        //       sectorLabel: sectorLabel,
        //       firName: facilityDataFromFile.fir.firName,
        //       notes: "",
        //     },
        //   });
        //   const currFirIndex = returnMessage.firs.length - 1;
        //   returnMessage.firs[currFirIndex]?.syncMessages.push(
        //     `Sector ${sector.sectorID} ${sector.sectorLabel} created in database`
        //   );
        // }
      }

      // TODO: Prevent duplicate sector IDs in the same FIR
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

            returnMessage.firs[currFirIndex].syncMessages.push(
              `Sector ${sector.sectorID} label updated from '${OldLabel}' to '${sector.sectorLabel}'`
            );
          }
        }

        // const sector = await ctx.prisma.sector.upsert({
        //   where: {
        //     uniqueSectorID: sectorFromDB?.uniqueSectorID,
        //   },
        //   update: {
        //     sectorLabel: facilityDataFromFile.sectors[sectorIDFile],
        //   },
        //   create: {
        //     sectorID: sectorIDFile,
        //     sectorLabel: sectorLabel,
        //     firName: facilityDataFromFile.fir.firName,
        //     notes: "",
        //   },
        // });
      }

      // TODO: Remove sectors that are in the DB but not in the file

      // console.log("facilityDataFromDB", facilityDataFromDB?.sectors);
      // console.log("facilityDataFromFile", facilityDataFromFile.sectors);
    }
  });

  await Promise.all(dataPromises);

  // console.log("parsed data!", parsedData);
  return returnMessage;
}
