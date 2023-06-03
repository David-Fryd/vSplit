import _ from 'lodash';
import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";
import { Deliverable, GroupCollection } from '~/types/facilityData';
import { syncFacilityData } from "~/utils/facilityData/server/syncFacilityData";

export const facilityDataRouter = createTRPCRouter({
  // TODO: Remove me, after removing my use in TempSplitter.tsx
  getAllSectorFromFIR: publicProcedure
    .input(z.object({ firName: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.sector.findMany({
        where: {
          firName: input.firName,
        },
      });
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

  // TODO: Is a better name appropriate here? What it's really doing
  // is overwriting the comprehensive facility data file and updating
  // the facility dataset timestamp in the database. It's a single pull
  // of the individual files, and generation of the merged one.
  syncFacilityData: protectedProcedure.mutation(({ ctx }) => {
    console.log("sync facility data endpoint called");
    return syncFacilityData({ ctx });
  }),

  // TODO: This is covered by getGroupData. Remove me once all users
  // are reconnected to this.getGroupData()
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

  // TODO: remove
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

  // TODO: improve naming
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

      // ---------- start new stuff below --------------

      // build the group data deliverable
      const currentGroupDbEntry = await ctx.prisma.deliverables.findFirst({ where: { deliverableName: 'groupData' }}) as Deliverable;
      console.log(currentGroupDbEntry);
      const currentGroupDataJson = JSON.parse(currentGroupDbEntry.content) as GroupCollection;
      const groupTable = await ctx.prisma.group.findMany();
      const nextGroupDataJson: GroupCollection = {
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
      if (!_.isEqual(nextGroupDataJson.groups, currentGroupDataJson.groups)) {
        // update the groupdata deliverable in the database
        await ctx.prisma.deliverables.update({
          where: {
            deliverableName: 'groupData'
          },
          data: {
            content: JSON.stringify(nextGroupDataJson)
          }
        });

        // update the group dataset timestamp in the database
        await ctx.prisma.timestamps.update({
          where: {
            name: 'groupDatasetTimestamp'
          },
          data: {
            value: nextGroupDataJson.timestamp
          }
        });
      }

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
