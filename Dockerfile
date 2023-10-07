# FROM node:14.21.2-alpine3.16 as build

# WORKDIR /usr/app

# COPY . /usr/app

# RUN yarn install

# RUN yarn build

# CMD ["yarn", "start"]

# FROM node:14.21.2-alpine3.16

# ENV NUXT_VERSION=2.15.8

# WORKDIR /app

# ADD ./ ./
# RUN : \
#   && yarn install \
#   && yarn build --standalone \
#   && rm -rf node_modules \
#   && rm package.json \
#   && yarn add "nuxt-start@${NUXT_VERSION}" \
#   && yarn cache clean \
#   && :

# ENTRYPOINT ["npx", "nuxt-start"]
# EXPOSE 3001

FROM node:14.21.2-alpine3.16 as frontend-build

WORKDIR /src

ADD ./yarn.lock ./package.json ./
RUN yarn install

ADD ./ ./
RUN yarn build --standalone

FROM node:14.21.2-alpine3.16

ENV NUXT_VERSION=2.15.8

WORKDIR /app

RUN yarn add "nuxt-start@${NUXT_VERSION}"

ENV NODE_ENV production

COPY --from=frontend-build /src/.nuxt /app/.nuxt
COPY --from=frontend-build /src/node_modules /app/node_modules
COPY --from=frontend-build /src/static /app/static
COPY --from=frontend-build /src/nuxt.config.js /app/
COPY --from=frontend-build /src/static /app/


ENTRYPOINT ["npx", "nuxt-start"]
EXPOSE 3001
