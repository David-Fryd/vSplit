import { createTRPCRouter } from "~/server/api/trpc";
import { exampleRouter } from "~/server/api/routers/example";
import { facilityDataRouter } from "~/server/api/routers/facilitydata";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  example: exampleRouter,
  facilitydata: facilityDataRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
