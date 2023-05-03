import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

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

  // getAllSectorWithVolumes: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.sector.findMany({
  //     include: {
  //       volumes: true,
  //     },
  //   });
  // }),

  // hello: publicProcedure
  //   .input(z.object({ text: z.string() }))
  //   .query(({ input }) => {
  //     return {
  //       greeting: `Hello ${input.text}`,
  //     };
  //   }),

  // getAll: publicProcedure.query(({ ctx }) => {
  //   return ctx.prisma.example.findMany();
  // }),

  // getSecretMessage: protectedProcedure.query(() => {
  //   return "you can now see this secret message!";
  // }),
});
