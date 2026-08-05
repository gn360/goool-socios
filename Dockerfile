# ─── Build Stage ───────────────────────────────────────────────────
FROM node:22-alpine AS builder

WORKDIR /app

# Copy SDK source — required for file:../goool-sdk resolution in package.json.
# npm resolves the relative path: /app/../goool-sdk → /goool-sdk.
COPY goool-sdk/package.json goool-sdk/tsconfig.json goool-sdk/tsconfig.build.json /goool-sdk/
COPY goool-sdk/src/ /goool-sdk/src/

# Install dependencies (npm ci resolves file:../goool-sdk → /goool-sdk)
COPY goool-socios/package.json goool-socios/package-lock.json ./
RUN npm ci

# Copy application source
COPY goool-socios/ ./

# Build-time API URL — Vite inlines VITE_* environment variables at build time.
# Override via: docker build --build-arg VITE_API_BASE_URL=...
ARG VITE_API_BASE_URL=https://api.goool.uy/api
ENV VITE_API_BASE_URL=$VITE_API_BASE_URL

RUN npm run build

# ─── Runtime Stage ─────────────────────────────────────────────────
FROM nginx:1.27-alpine

# SPA fallback + asset caching (identical across all frontend repos)
COPY goool-socios/nginx.conf /etc/nginx/conf.d/default.conf

# Pre-built static files
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=5s --retries=3 \
    CMD wget --no-verbose --tries=1 --spider http://localhost/ || exit 1

# Non-root runtime user
USER nginx

CMD ["nginx", "-g", "daemon off;"]
