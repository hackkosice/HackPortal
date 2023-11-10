FROM ubuntu:latest AS base
# nvm requirements
RUN apt-get update
RUN echo "y" | apt-get install curl
# nvm env vars
RUN mkdir -p /usr/local/nvm
ENV NVM_DIR /usr/local/nvm
# IMPORTANT: set the exact version
ENV NODE_VERSION v18.18.0
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.5/install.sh | bash
RUN /bin/bash -c "source $NVM_DIR/nvm.sh && nvm install $NODE_VERSION && nvm use --delete-prefix $NODE_VERSION"
# add node and npm to the PATH
ENV NODE_PATH $NVM_DIR/versions/node/$NODE_VERSION/bin
ENV PATH $NODE_PATH:$PATH

RUN npx playwright install-deps

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Install dependencies based on the preferred package manager
COPY package.json package-lock.json* ./
RUN npm ci


# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Setup environment variables
RUN cp .env.template .env
RUN echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)\n" >> .env
RUN echo "DATABASE_URL=\"file:./prod.db\"" >> .env
ENV NEXTAUTH_URL http://localhost:3004
ENV BREVO_API_KEY test-api-key
ENV BASE_URL http://localhost:3004

# Setup database
RUN npm run prisma:generate
RUN npm run prisma:migrate-prod
RUN npm run prisma:seed

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
ENV NEXT_TELEMETRY_DISABLED 1

RUN npm run build

# If using npm comment out above and use below instead
# RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
# Uncomment the following line in case you want to disable telemetry during runtime.
ENV NEXT_TELEMETRY_DISABLED 1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/ou otput-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nextjs:nodejs /app/e2e ./e2e
COPY --from=builder --chown=nextjs:nodejs /app/playwright.config.ts ./
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

RUN npx playwright install

ENV PORT 3004
ENV HOSTNAME 0.0.0.0
ENV NEXTAUTH_URL http://localhost:3004
ENV BREVO_API_KEY test-api-key
ENV BASE_URL http://localhost:3004

CMD ["node", "server.js"]
