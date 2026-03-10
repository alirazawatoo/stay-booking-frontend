# Node version matches .nvmrc and package.json engines.
FROM node:22-bookworm-slim AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --ignore-scripts --no-audit --no-fund

# `docker build --target check .` runs the same lint and tests as `npm run lint && npm test`.
FROM deps AS check
COPY . .
RUN npm run lint && npm test

FROM deps AS build
COPY . .
# Vite embeds these at build time; they end up in public JavaScript, so never put secrets here.
ARG VITE_API_URL=http://127.0.0.1:8000/
ARG BUILD_MODE=production
ENV VITE_API_URL=${VITE_API_URL}
RUN npm run build -- --mode ${BUILD_MODE}

FROM nginx:1.30-alpine AS web
COPY docker/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
