FROM node:14.21.2-alpine3.16 as build

WORKDIR /usr/app

COPY . /usr/app

RUN npm install

RUN npm run build

CMD ["npm", "start"]
