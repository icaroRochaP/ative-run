FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY turbo.json ./
COPY apps/portal-web/package.json ./apps/portal-web/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy source code
COPY . .

# Build the application
RUN pnpm --filter=portal-web build

# Production stage
FROM node:20-alpine AS runner
RUN npm install -g pnpm

WORKDIR /app

# Copy built application
COPY --from=base /app/apps/portal-web/.next/standalone ./
COPY --from=base /app/apps/portal-web/.next/static ./apps/portal-web/.next/static
COPY --from=base /app/apps/portal-web/public ./apps/portal-web/public

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "apps/portal-web/server.js"]
