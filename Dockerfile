# ─── Build Stage ────────────────────────────────────────────────────
FROM node:22-alpine AS build

WORKDIR /app

# Install dependencies (layer cached unless package*.json changes)
COPY package*.json ./
RUN npm ci

# Copy source and build
COPY . .
RUN npm run build

# ─── Serve Stage ────────────────────────────────────────────────────
FROM nginx:1.27-alpine

# Remove default Nginx config
RUN rm -f /etc/nginx/conf.d/default.conf

# Copy custom Nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets from build stage
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

# Run Nginx in the foreground
CMD ["nginx", "-g", "daemon off;"]
