# Build stage: Use Node.js Alpine as the base image for smaller footprint
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm ci

# Copy application code
COPY . .

# Production stage: Create a smaller image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Set environment variables
ENV NODE_ENV=production
ENV PORT=8000

# Create app directory with proper permissions for non-root user
RUN mkdir -p /app/logs && \
    chown -R node:node /app

# Copy only production dependencies and built code from builder stage
COPY --from=builder --chown=node:node /app/package*.json ./
RUN npm ci --only=production && \
    npm cache clean --force

# Copy application code
COPY --from=builder --chown=node:node /app/ ./

# Create volume for logs (persistent storage)
VOLUME [ "/app/logs" ]

# Expose API port
EXPOSE 8000

# Use non-root user for better security
USER node

# Healthcheck to verify container is functioning
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD node -e "try { require('http').request({port: 8000, path: '/'}, (r) => r.statusCode === 200 ? process.exit(0) : process.exit(1)).end(); } catch (e) { process.exit(1); }"

# Start the application with a production-ready approach
CMD ["node", "index.js"]