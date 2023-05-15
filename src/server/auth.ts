import { type GetServerSidePropsContext } from "next";
import {
  getServerSession,
  type NextAuthOptions,
  type DefaultSession,
  User,
  Account,
  Profile,
} from "next-auth";
import DiscordProvider from "next-auth/providers/discord";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { env } from "~/env.mjs";
import { prisma } from "~/server/db";
import type { VATSIMProfile } from "~/types/vatsim";
import { Prisma } from "@prisma/client";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      ratingID: number; // VATSIM Rating ID
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    ratingID: number; // VATSIM Rating ID
    // ...other properties
    // role: UserRole;
  }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
    session: ({ session, user }) => ({
      ...session,
      user: {
        ...session.user,
        id: user.id,
        ratingID: user.ratingID, // VATSIM rating ID
      },
    }),
    // Manually modify signIn callback to update the user's ratingID if it has changed since last login
    signIn: async ({
      user,
      account,
      profile,
    }: {
      user: User;
      account: Account | null;
      profile?: Profile | VATSIMProfile | undefined;
    }) => {
      if (
        account &&
        (account.provider === "vatsim" || account.provider === "vatsim-dev") &&
        profile &&
        "data" in profile
      ) {
        const ratingID = profile.data.vatsim.rating.id;

        // Use Prisma's upsert method to either create a new user or update an existing one
        await prisma.user.upsert({
          where: { id: user.id },
          update: { ratingID },
          create: {
            id: user.id,
            name: user.name,
            email: user.email,
            ratingID,
          },
        });
      }

      // If no errors are thrown, sign-in will be successful
      return true;
    },
  },
  adapter: PrismaAdapter(prisma),
  providers: [
    // DiscordProvider({
    //   clientId: env.DISCORD_CLIENT_ID,
    //   clientSecret: env.DISCORD_CLIENT_SECRET,
    // }),
    {
      id: "vatsim",
      name: "VATSIM",
      type: "oauth",
      authorization: {
        url: "https://auth.vatsim.net/oauth/authorize",
        params: {
          response_type: "code",
          scope: "full_name vatsim_details email",
          prompt: "login", // force user to enter their credentials every time
        },
      },
      token: "https://auth.vatsim.net/oauth/token",
      userinfo: "https://auth.vatsim.net/api/user",
      profile(profile: VATSIMProfile) {
        console.log("VATSIM profile:", profile);
        return {
          id: profile.data.cid,
          ratingID: profile.data.vatsim.rating.id,
          name: `${profile.data.personal.name_first} ${profile.data.personal.name_last}`,
          email: profile.data.personal.email,
          image: null,
        };
      },
      clientId: process.env.VATSIM_CLIENT_ID,
      clientSecret: process.env.VATSIM_CLIENT_SECRET,
    },
    {
      id: "vatsim-dev",
      name: "VATSIM Dev",
      type: "oauth",
      authorization: {
        url: "https://auth-dev.vatsim.net/oauth/authorize",
        params: {
          response_type: "code",
          scope: "full_name vatsim_details email",
          prompt: "login", // force user to enter their credentials every time
        },
      },
      token: "https://auth-dev.vatsim.net/oauth/token",
      userinfo: "https://auth-dev.vatsim.net/api/user",
      profile(profile: VATSIMProfile) {
        console.log("VATSIM Dev profile:", profile);
        console.log("setting the ratingID to ", profile.data.vatsim.rating.id);
        return {
          id: profile.data.cid,
          ratingID: profile.data.vatsim.rating.id,
          name: `${profile.data.personal.name_first} ${profile.data.personal.name_last}`,
          email: profile.data.personal.email,
          image: null,
        };
      },
      clientId: process.env.VATSIM_DEV_CLIENT_ID,
      clientSecret: process.env.VATSIM_DEV_CLIENT_SECRET,
    },
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
