# PoultryFit Kenya website — Docker build (Node target)
# Separate from the Cloudflare Workers deployment (vite.config.ts / wrangler.jsonc),
# this uses vite.config.docker.ts so both deployment paths coexist untouched.

FROM node:22-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx vite build --config vite.config.docker.ts

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/package*.json ./
EXPOSE 3000
CMD ["node", "node_modules/srvx/bin/srvx.mjs", "--prod", "-s", "../client", "dist/server/server.js"]