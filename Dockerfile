FROM node:20-alpine

WORKDIR /app

# Copy workspace files
COPY package.json pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy portal-web package.json
COPY apps/portal-web/package.json ./apps/portal-web/

# Install dependencies
RUN cd apps/portal-web && npm install

# Copy all source code
COPY . .

# Build the portal-web application
RUN cd apps/portal-web && npm run build

# Expose port
EXPOSE 3000

# Start the application
CMD ["sh", "-c", "cd apps/portal-web && npm start"]