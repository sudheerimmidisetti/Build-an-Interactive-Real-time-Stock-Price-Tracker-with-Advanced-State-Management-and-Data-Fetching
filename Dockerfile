# Stage 1: Build production bundle
FROM node:20-alpine AS build

WORKDIR /app

# Accept Vite environment variables as build arguments
ARG VITE_STOCK_API_KEY
ENV VITE_STOCK_API_KEY=$VITE_STOCK_API_KEY

# Cache dependencies
COPY package.json package-lock.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# Stage 2: Serve production bundle with Nginx
FROM nginx:alpine AS runner

# Remove default nginx HTML
RUN rm -rf /usr/share/nginx/html/*

# Copy built assets from builder stage
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose HTTP ports 80 and 8080
EXPOSE 80 8080

# Run nginx in foreground
CMD ["nginx", "-g", "daemon off;"]
