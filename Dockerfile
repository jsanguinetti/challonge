# --- Installing stage
FROM node:10.16 AS installer

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install --only=production

# --- Build stage
# Running code under slim image (production part mostly)
FROM node:10.16-alpine AS builder

## Clean new directory
WORKDIR /app

## We just need node_modules
COPY --from=installer /app/node_modules node_modules
COPY --from=installer /app/package.json package.json
COPY ./src src
COPY ./tsconfig.json tsconfig.json

RUN npm run-script build


# --- Run stage
FROM node:10.16-alpine

## Clean new directory
WORKDIR /app

## We just need node_modules
COPY --from=builder /app/node_modules node_modules
COPY --from=builder /app/package.json package.json
COPY --from=builder /app/dist dist
COPY ./newrelic.js newrelic.js
COPY ./ormconfig.js ormconfig.js
COPY ./tsconfig.json tsconfig.json

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

ENTRYPOINT [ "node", "dist/main.js" ]
