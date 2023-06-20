FROM node:14.21.2-alpine3.16 as build

WORKDIR /usr/app

COPY . /usr/app

RUN yarn install

RUN yarn build

CMD ["yarn", "start"]
