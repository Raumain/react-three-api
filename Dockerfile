# Use Bun as the base image
FROM oven/bun:1.0 as build

# Set working directory
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install 

# Copy source files
COPY . .

# Build if needed (uncomment if you have a build step)
# RUN bun run build

# Create production image
FROM oven/bun:1.0

WORKDIR /app

# Copy dependencies and built files from the build stage
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package.json ./
COPY --from=build /app/src ./src

# Expose the port your app runs on
EXPOSE 3000

# Set environment variables
ENV NODE_ENV=production

# Run the application
CMD ["bun", "src/index.ts"]