# --- Installing stage
FROM node:12.6 AS installer

WORKDIR /app

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

COPY package.json ./
COPY yarn.lock ./
RUN yarn install

# Running code under slim image (production part mostly)
FROM node:12.6-alpine

## Clean new directory
WORKDIR /app

## We just need node_modules
COPY --from=installer /app/node_modules node_modules
COPY --from=installer /app/package.json package.json
COPY ./src src
COPY ./index.js index.js
COPY ./newrelic.js newrelic.js
COPY ./ormconfig.js ormconfig.js
COPY ./tsconfig.json tsconfig.json

CMD [ "yarn", "start" ]
