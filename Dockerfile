# ==============================
# Stage 1 - Dependencies
# ==============================
FROM node:22-alpine AS dependencies

WORKDIR /app

COPY package*.json ./

RUN npm ci --omit=dev


# ==============================
# Stage 2 - Production Runtime
# ==============================
FROM node:22-alpine AS production

WORKDIR /app

# Remove package managers from the production image
RUN rm -rf \
    /usr/local/lib/node_modules/npm \
    /usr/local/bin/npm \
    /usr/local/bin/npx

COPY --from=dependencies /app/node_modules ./node_modules

COPY --chown=node:node src ./src

ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

USER node

CMD ["node", "src/server.js"]
