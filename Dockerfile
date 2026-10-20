# syntax=docker/dockerfile:1
FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1
RUN apt-get update \
    && apt-get install -y --no-install-recommends openssl ca-certificates \
    && rm -rf /var/lib/apt/lists/*

FROM base AS dependencies
RUN npm install --global pnpm@11.25.0
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile

# Executado uma vez pelo Compose, antes de iniciar a aplicação.
FROM dependencies AS migrate
COPY --chown=node:node prisma ./prisma
USER node
CMD ["node", "node_modules/prisma/build/index.js", "migrate", "deploy"]

FROM dependencies AS builder
COPY . .
# Endereço público; nunca passe segredos como argumentos de build.
ARG APP_URL=http://127.0.0.1:3000
ENV APP_URL=${APP_URL}
RUN pnpm build

FROM base AS runner
ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public
COPY --chown=node:node scripts/healthcheck.mjs ./healthcheck.mjs
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=6s --start-period=30s --retries=3 \
    CMD ["node", "healthcheck.mjs"]
CMD ["node", "server.js"]
