## Requirements

**System requirements**

- [Node.js 18.7](https://nodejs.org/) or later
- Node package manager - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- macOS, Windows (including WSL), and Linux are supported

## Installation and configuration

1. Use git to clone this repository:

```bash
git clone https://github.com/hackkosice/HackPortal.git
```

Alternatively you can download the code from Github using “Download ZIP” option if your system doesn’t have git installed (not recommended).

2. Use Node package manager to install all required dependencies by running in the root of the project:

```bash
npm install
```

3. Prepare `.env` file containing required environment variables by copying the provided template and filling the values.

```bash
cp .env.template .env
```

Env variables:

- PORT - port on which the server will listen, if not specified the default value is 3000
- BASE_URL - base URL of the server, for local development on default port it’s `http://localhost:3000`
- NEXTAUTH_URL - same as BASE_URL, used as callback URL for OAuth providers
- NEXT_AUTH_SECRET - secret key for generating the JWT tokens used by NextAuth for handling user sessions. You can obtain strong secret key on Unix by running `openssl rand -base64 32`
- DATABASE_URL - connection string used by Prisma ORM to connect to your database. Checkout Prisma docs to see what database are supported. Example value if you want to use SQLite database from local file: `file:./portal.db`


The following environment variables are required for OAuth authentication to work. You can obtain the values by creating OAuth apps on the respective platforms:

- GITHUB_CLIENT_ID - OAuth client ID for Github OAuth app
- GITHUB_CLIENT_SECRET - OAuth client secret for Github OAuth app
- GOOGLE_CLIENT_ID - OAuth client ID for Google OAuth app
- GOOGLE_CLIENT_SECRET - OAuth client secret for Google OAuth app

The folowing environment variables are required for storing files on Cloudflare R2 Storage. You can obtain the values by creating a bucket on Cloudflare R2 Storage and generating API keys:

- CLOUDFLARE_R2_BUCKET_NAME - name of the R2 bucket where the files will be stored
- CLOUDFLARE_R2_ACCOUNT_ID - account ID of the R2 bucket
- CLOUDFLARE_R2_ACCESS_KEY_ID - access key ID of the R2 bucket
- CLOUDFLARE_R2_SECRET_ACCESS_KEY - secret access key of the R2 bucket

The following environment variables are used for sending emails. The current implementation uses [Brevo](https://brevo.com/) API for sending emails. You can obtain the API key by creating an account on Brevo and generating an API key:

- EMAILS_ENABLED - set to `true` to enable sending emails, if not set or set to `false` the emails will be logged to the console instead of sending them
- BREVO_API_KEY - API key for Brevo API

The following environment variables are used for monitoring and logging. You can obtain the values by creating an account on Sentry and Datadog and following the instructions for creating a project:

- NEXT_PUBLIC_SENTRY_ENABLED - set to `true` to enable Sentry error reporting, if not set or set to `false` Sentry won't be initialized
- SENTRY_ORGANIZATION - Sentry organization name
- SENTRY_PROJECT - Sentry project name
- SENTRY_AUTH_TOKEN - Sentry auth token
- NEXT_PUBLIC_SENTRY_DSN - Sentry DSN


- NEXT_PUBLIC_DATADOG_ENABLED - set to `true` to enable Datadog monitoring, if not set or set to `false` Datadog won't be initialized
- NEXT_PUBLIC_DATADOG_CLIENT_TOKEN - Datadog client token
- NEXT_PUBLIC_DATADOG_SITE - Datadog site
- NEXT_PUBLIC_LOG_DEBUG - set to `true` to enable debug logging, all logs will be displayed in the console instead of being sent to Datadog

The following environment variables are used for generating check-in QR codes:

- CHECKIN_CODE_KEY - 32 byte long key in base64 used for generating check-in codes. You can obtain strong secret key on Unix by running `openssl rand -base64 32`

If you want to just test out the portal without enabling all the services you can use this example `.env` file:

```
PORT=3000
BASE_URL=http://localhost:3000

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=secret # replace this!

DATABASE_URL="file:./portal.db"

GITHUB_CLIENT_ID=id
GITHUB_CLIENT_SECRET=secret

GOOGLE_CLIENT_ID=id
GOOGLE_CLIENT_SECRET=secret

CLOUDFLARE_R2_BUCKET_NAME=bucket
CLOUDFLARE_R2_ACCOUNT_ID=id
CLOUDFLARE_R2_ACCESS_KEY_ID=id
CLOUDFLARE_R2_SECRET_ACCESS_KEY=secret

EMAILS_ENABLED=false
BREVO_API_KEY=key

NEXT_PUBLIC_SENTRY_ENABLED=false
SENTRY_ORGANIZATION=org
SENTRY_PROJECT=project
SENTRY_AUTH_TOKEN=token
NEXT_PUBLIC_SENTRY_DSN=dsn

NEXT_PUBLIC_DATADOG_ENABLED=false
NEXT_PUBLIC_DATADOG_CLIENT_TOKEN=token
NEXT_PUBLIC_DATADOG_SITE=site
NEXT_PUBLIC_LOG_DEBUG=true

CHECKIN_CODE_KEY=key # replace this!
```

**Not that this `.env` file is not suitable for production use and will disable core features of the portal such as OAuth authentication, sending emails, saving files, monitoring and logging.**

4. Run database migrations to generate required tables and seed the database with initial values (mostly enums):
- In development environment:

```bash
npm run prisma:migrate-dev
npm run prisma:seed
```
- In production environment:

```bash
npm run prisma:migrate-prod
npm run prisma:seed
```

## Running the server

### Dev environment

A development server will start after using the `npm run dev` command. This server will compile the pages on the fly and includes the hot-reload feature. **You** **shouldn’t ever use this in the production environment**.

```bash
npm run dev
```

### Production environment

Starting a production server requires two steps - building and compiling files (`npm run build`), serving those compiled files (`npm run start`). After every update of the source files you have to run both commands in order to correctly restart the server.

```bash
npm run build
npm run start
```

### Specifying port

You can export the PORT environment variable to specify on which port the server will listen (both for development and production server). Example command on Unix based systems:

```bash
export PORT=3003 && npm run start
```
