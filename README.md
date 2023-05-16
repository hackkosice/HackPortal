## Requirements

**System requirements**

- [Node.js 16.8](https://nodejs.org/) or later
- Node package manage - [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
- macOS, Windows (including WSL), and Linux are supported

**Hardware requirements**

- no minimum hardware requirements are needed. We recommend estimating traffic, the number of records and the number of saved files for your specific deployment and choosing hardware for your server accordingly.

## Installation and configuration

1. Use git to clone this repository:

```bash
git clone https://github.com/hackkosice/HackPortal.git
```

Alternatively you can download the code from Github using “Download ZIP” option if your system doesn’t have git installed (not recommended).

1. Use Node package manager to install all required dependencies by running:

```bash
npm install
```

1. Prepare `.env` file containing required environment variables by copying the provided template and filling the values.

```bash
cp .env.template .env
```

Env variables:

- NEXT_AUTH_SECRET - secret key for generating the JWT tokens used by NextAuth for handling user sessions. You can obtain strong secret key on Unix by running `openssl rand -base64 32`
- DATABASE_URL - connection string used by Prisma ORM to connect to your database. Checkout Prisma docs to see what database are supported. Example value if you want to use SQLite database from local file: `file:./portal.db`

1. Run database migrations to generate required tables and seed the database with initial values (mostly enums):
- In production environment:

```bash
npm run prisma:migrate-prod
npm run prisma:seed
```

- In development environment:

```bash
npm run prisma:migrate-dev
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
