# vSplit

An open-source sector configuration mapping tool for VATSIM.

## Developer Quick Start Guide

1. Ensure [NodeJS](https://nodejs.org/en/download) is installed.
    - If you work with multiple versions of node, we highly recommend [nvm](https://github.com/nvm-sh/nvm) (macOS/linux), or [nvm-windows](https://github.com/coreybutler/nvm-windows) (windows).
1. Run `npm install` on the command line to install required dependencies.
1. Create `.env` from `.env.example`, and fill out `VATSIM_DEV_CLIENT_ID` and `VATSIM_DEV_CLIENT_SECRET`.
    - You will need to contact us for these. (???)
1. Create a PostgreSQL database using [Railway](https://railway.app/). This is free, no account needed (though creating an account will ensure the database persists). Or, if you have experience working with PostgreSQL, and prefer to spin a database up on your own with other methods, feel free.
1. Using Railway, the setup process is as follows:
    - Click "Start New Project" --> "Provision PostgreSQL".
    - When the Postgres tile appears in the middle of the page, click it to open.
    - Under the connect tab, under "Available Variables", copy the `DATABASE_URL`.
    - Paste that URL as `DATABASE_URL` in the `.env` file in the vSplit repository.
1. Run `npx prisma db push` on the command line to set up the database structure.
1. Run `npm run dev` on the command line to build and run the app.
1. Open the vSplit database sync page at [`http://localhost:3000/sync](http://localhost:3000/sync).
1. On the left side, click "Log In" --> "Sign In with VATSIM Dev", and use the following credentials:
    - CID:  10000005
    - PW:   10000005
1. You should now be logged in. Click "Sync Database" to populate the database with the latest facility data.
1. Click "MAP" to return to the map, or just visit [`http://localhost:3000](http://localhost:3000).
1. Proceed with development. Some notes:
    - If you change facility data, you will need to resync the database, as in step 8.
    - If you change other parts of the app, it will automatically rebuild on file save. You do not need to restart `npm run dev`, as long as it is still running.


<!-- # Create T3 App

This is a [T3 Stack](https://create.t3.gg/) project bootstrapped with `create-t3-app`.

## What's next? How do I make an app with this?

We try to keep this project as simple as possible, so you can start with just the scaffolding we set up for you, and add additional things later when they become necessary.

If you are not familiar with the different technologies used in this project, please refer to the respective docs. If you still are in the wind, please join our [Discord](https://t3.gg/discord) and ask for help.

- [Next.js](https://nextjs.org)
- [NextAuth.js](https://next-auth.js.org)
- [Prisma](https://prisma.io)
- [Tailwind CSS](https://tailwindcss.com)
- [tRPC](https://trpc.io)

## Learn More

To learn more about the [T3 Stack](https://create.t3.gg/), take a look at the following resources:

- [Documentation](https://create.t3.gg/)
- [Learn the T3 Stack](https://create.t3.gg/en/faq#what-learning-resources-are-currently-available) — Check out these awesome tutorials

You can check out the [create-t3-app GitHub repository](https://github.com/t3-oss/create-t3-app) — your feedback and contributions are welcome!

## How do I deploy this?

Follow our deployment guides for [Vercel](https://create.t3.gg/en/deployment/vercel), [Netlify](https://create.t3.gg/en/deployment/netlify) and [Docker](https://create.t3.gg/en/deployment/docker) for more information. -->
