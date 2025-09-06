FROM node:20-alpine

WORKDIR /app

# Install pnpm globally
RUN npm install -g pnpm

# Copy workspace files
COPY package.json pnpm-workspace.yaml pnpm-lock.yaml ./

# Copy portal-web package.json
COPY apps/portal-web/package.json ./apps/portal-web/

# Install dependencies using pnpm (mais eficiente)
RUN pnpm install --frozen-lockfile --production=false

# Copy all source code
COPY . .

# Build the portal-web application  
RUN cd apps/portal-web && pnpm run build

# Clean dev dependencies to save space
RUN pnpm prune --production

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "cd apps/portal-web && pnpm start"]