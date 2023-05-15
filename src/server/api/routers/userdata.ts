import { z } from "zod";

import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
} from "~/server/api/trpc";

export const userdataRouter = createTRPCRouter({
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

  getSecretMessage: protectedProcedure.query(() => {
    return "you can now see this secret message!";
  }),

  // protectedProcedure that given a user id, returns the user's data
  // getUserData: protectedProcedure
  //   .input(z.object({ id: z.string() }))
  //   .query(({ input, ctx }) => {
  //     return ctx.prisma.user.findUnique({
  //       where: {
  //         id: input.id,
  //       },
  //     });
  //   }),

  // Return the `acceptedHonorCode` boolean field of the user
  getUserHonorCode: protectedProcedure
    .input(z.object({ id: z.string() }))
    .query(({ input, ctx }) => {
      return ctx.prisma.user.findUnique({
        where: {
          id: input.id,
        },
        select: {
          acceptedHonorCode: true,
        },
      });
    }),

  setUserHonorCode: protectedProcedure
    .input(z.object({ id: z.string(), acceptedHonorCode: z.boolean() }))
    .mutation(({ input, ctx }) => {
      return ctx.prisma.user.update({
        where: {
          id: input.id,
        },
        data: {
          acceptedHonorCode: input.acceptedHonorCode,
        },
      });
    }),
});
