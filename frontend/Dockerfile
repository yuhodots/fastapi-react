FROM node:20-alpine as build

WORKDIR /app

COPY package.json ./

RUN yarn install

COPY . /app

CMD ["yarn", "run", "start"]
