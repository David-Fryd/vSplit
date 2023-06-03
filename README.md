# vSplit

An open-source sector configuration mapping tool for VATSIM.

## Developer Quick Start Guide

1. Ensure [NodeJS](https://nodejs.org/en/download) is installed.
   - If you work with multiple versions of node, we highly recommend [nvm](https://github.com/nvm-sh/nvm) (macOS/linux), or [nvm-windows](https://github.com/coreybutler/nvm-windows) (windows).
1. Run `npm install` from the project's root directory (using the command line) to install required dependencies.
1. Create the file `.env` using the `.env.example` as a reference, and fill out `VATSIM_DEV_CLIENT_ID` and `VATSIM_DEV_CLIENT_SECRET`.
   - In order for authentication to work, you need to register your local version of vSplit with the VATSIM development enviornment that provides authentication services.
   - Follow the [Connect Development Enviornment](https://github.com/vatsimnetwork/developer-info/wiki/Connect-Development-Environment) instructions in order to register your own application with the VATSIM development environment.
     - When registering a new client, the `Return URL` should be `http://localhost:3000/api/auth/callback/vatsim-dev` (assuming your local instance is running on port 3000 and that the default callback route has not been changed).
   - Use the generated ID/SECRET as the values for `VATSIM_DEV_CLIENT_ID` and `VATSIM_DEV_CLIENT_SECRET` in your `.env` file.
1. Create and host an instance of a PostgreSQL database.
   - We recommend using [Railway](https://railway.app/). This is free, no account needed (though creating an account will ensure the database persists). Or, if you have experience working with PostgreSQL, and prefer to spin a database up on your own with other methods, feel free.
   - Using Railway, the setup process is as follows:
     - Click "Start New Project" --> "Provision PostgreSQL".
     - When the Postgres tile appears in the middle of the page, click it to open.
     - Under the connect tab, under "Available Variables", copy the `DATABASE_URL` (then see next step).
1. In the `.env` file you created earlier, set the `DATABASE_URL` variable to the database's URL (allows your app to connect to the database). If you used Railway, you can simply paste the `DATABASE_URL` you copied in the previous step. The line should look something like: `DATABASE_URL='postgresql://postgres:...'`, or if you have a locally hosted postgresql db: `DATABASE_URL='postgresql://postgres:@localhost:5432/mydatabase'`
1. Run `npx prisma db push` on the command line to automatically set up the database structure using the prisma schema.
1. Run `npm run dev` on the command line to build and run the app.
1. On the left sidebar, click "Log In" --> "Sign In with VATSIM Dev", and sign in using dummy credentials provided by the VATSIM enviornment. You can find a list of valid credentials [here](https://github.com/vatsimnetwork/developer-info/wiki/Connect-Development-Environment). The following is an example of an account you could log in with:
   - CID: 10000005
   - PW: 10000005
1. Open the vSplit database sync page at [`http://localhost:3000/sync](http://localhost:3000/sync).
1. You should already be logged in (step 7). Click "Sync Database" to populate the database with the latest facility data.
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
