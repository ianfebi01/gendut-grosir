FROM node:22-alpine AS build

WORKDIR /src

COPY ./package.json ./yarn.lock ./
RUN yarn install --frozen-lockfile

COPY ./ ./
RUN yarn build

FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV NUXT_HOST=0.0.0.0
ENV NUXT_PORT=3001

WORKDIR /app

COPY --from=build /src/.output /app/.output
COPY --from=build /src/public /app/public
COPY --from=build /src/package.json /app/

EXPOSE 3001

ENTRYPOINT ["node", ".output/server/index.mjs"]
