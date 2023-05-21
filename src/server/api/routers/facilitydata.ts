import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { syncFacilityData } from "~/utils/facilityData/server/syncFacilityData";

import fs from "fs/promises";
import path from "path";

export const facilityDataRouter = createTRPCRouter({
  getFIRsWithSectors: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fIR.findMany({
      include: {
        sectors: true,
      },
    });
  }),

  getAllFIR: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fIR.findMany();
  }),

  getAllSectorFromFIR: publicProcedure
    .input(z.object({ fir: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.sector.findMany({
        where: {
          firName: input.fir,
        },
      });
    }),

  getAllSector: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.sector.findMany();
  }),

  getFacilityDataFilenames: publicProcedure.query(({ ctx }) => {
    const directoryPath = path.join(process.cwd(), "public", "facilityData");
    // List all files in the directory
    const files = fs.readdir(directoryPath);
    return files;
  }),

  syncFacilityData: protectedProcedure.mutation(({ ctx }) => {
    console.log("sync facility data endpoint called");
    return syncFacilityData({ ctx });
  }),
});
