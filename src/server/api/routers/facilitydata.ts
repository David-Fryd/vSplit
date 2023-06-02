import * as _ from 'lodash';
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
    .input(z.object({ firName: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.sector.findMany({
        where: {
          firName: input.firName,
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

  getFacilityData: publicProcedure.query(({ ctx }) => {
    const facilityData =  ctx.prisma.deliverables.findFirst({
      where: { deliverableName: 'facilityData' },
    });

    console.log(facilityData);

    return facilityData;
  }),

  getGroupData: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.deliverables.findFirst({
      where: { deliverableName: 'groupData' },
    });
  }),

  syncFacilityData: protectedProcedure.mutation(({ ctx }) => {
    console.log("sync facility data endpoint called");
    return syncFacilityData({ ctx });
  }),

  getFIRsWithGroups: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.fIR.findMany({
      include: {
        sectors: {
          include: {
            group: true,
          },
        },
      },
    });
  }),

  getGroupsWithSectorsFromFIR: publicProcedure
    .input(z.object({ firName: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.group.findMany({
        where: {
          firName: input.firName,
        },
        include: {
          sectors: true,
        },
      });
    }),

  // update group data
  batchAssignGroupsToSectors: protectedProcedure
    .input(
      z.object({
        firName: z.string(),
        assignments: z.array(
          z.object({
            sectorId: z.string(),
            groupId: z.number(),
          })
        ),
      })
    )
    .mutation(async ({ input, ctx }) => {
      const { firName, assignments } = input;

      for (const { sectorId, groupId } of assignments) {
        const groupExists = await ctx.prisma.group.findUnique({
          where: { uniqueGroupID: groupId },
        });

        if (!groupExists) {
          throw new Error(`Group ${groupId} does not exist`);
        }

        const sectorExists = await ctx.prisma.sector.findFirst({
          where: {
            firName: firName,
            sectorID: sectorId,
          },
        });

        if (!sectorExists) {
          throw new Error(
            `Sector ${sectorId} does not exist in FIR ${firName}`
          );
        }

        // update the sector's group assignment
        await ctx.prisma.sector.update({
          where: {
            uniqueSectorID: sectorExists.uniqueSectorID,
          },
          data: {
            belongsToUniqueGroupID: groupId,
          },
        });
      }

      // TODO: Move this somewhere that it isn't needlessly repeating this action
      // build the group data deliverable
      const currentGroupDataJson = await ctx.prisma.deliverables.findFirst({ where: { deliverableName: 'groupData' }});
      const groupTable = await ctx.prisma.group.findMany();
      const nextGroupDataJson = {
        timestamp: Date.now(),
        groups: groupTable.map(groupTableRow => {
          const group = {
            id: groupTableRow.uniqueGroupID,
            fir: firName,
            name: groupTableRow.groupName,
            frequency: groupTableRow.groupFrequency,
            notes: groupTableRow.notes,
            color: groupTableRow.groupColor,
            sectorList: assignments.filter(a => a.groupId === groupTableRow.uniqueGroupID).map(b => b.sectorId)
          };

          return group;
        })
      };

      // if changes were made, update the group data deliverable with the new groupings
      // TODO: this if statement doesn't seem to work, it changes it regardless. But why?
      // if (!_.isEqual(nextGroupDataJson.groups, JSON.parse(currentGroupDataJson.content).groups)) {
      await ctx.prisma.deliverables.update({
        where: {
          deliverableName: 'groupData'
        },
        data: {
          content: JSON.stringify(nextGroupDataJson)
        }
      });
      // }

      return { message: "All updates were successful" };
    }),

  // assignGroupToSector: protectedProcedure
  //   .input(
  //     z.object({
  //       firName: z.string(),
  //       sectorId: z.string(),
  //       groupId: z.number(),
  //     })
  //   )
  //   .mutation(async ({ input, ctx }) => {
  //     const { firName, sectorId, groupId } = input;
  //     const groupExists = await ctx.prisma.group.findUnique({
  //       where: { uniqueGroupID: groupId },
  //     });
  //     if (!groupExists) {
  //       throw new Error("Group does not exist");
  //     }
  //     const updateResponse = await ctx.prisma.sector.updateMany({
  //       where: {
  //         firName: firName,
  //         sectorID: sectorId,
  //       },
  //       data: {
  //         belongsToUniqueGroupID: groupId,
  //       },
  //     });
  //     return updateResponse;
  //   }),
});
