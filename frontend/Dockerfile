# Build stage
FROM node:18-alpine AS build

# Set working directory
WORKDIR /app

# Copy package files for dependency installation
COPY package*.json ./

# Install all dependencies (including dev dependencies for the build)
RUN npm ci

# Copy application code
COPY . .

# Build the application
RUN npm run build

# Production stage with Nginx for serving static files
FROM nginx:alpine

# Copy the built application from the build stage
COPY --from=build /app/public /usr/share/nginx/html

# Copy custom Nginx configuration
COPY --from=build /app/public/index.html /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf

# Add custom nginx configuration to handle SPA routing
RUN echo 'server { \
    listen 80; \
    location / { \
        root /usr/share/nginx/html; \
        index index.html; \
        try_files $uri $uri/ /index.html; \
    } \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico)$ { \
        expires 30d; \
        add_header Cache-Control "public, no-transform"; \
    } \
    # Don't cache HTML \
    location ~* \.html$ { \
        expires -1; \
        add_header Cache-Control "no-store"; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Expose HTTP port
EXPOSE 80

# Healthcheck to verify container is functioning properly
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD wget -q -O /dev/null http://localhost:80/ || exit 1

# Command to start Nginx in foreground
CMD ["nginx", "-g", "daemon off;"]