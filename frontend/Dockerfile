FROM node:20-alpine as build

WORKDIR /app

COPY package.json ./

RUN npm install

COPY . /app

CMD ["npm", "start"]