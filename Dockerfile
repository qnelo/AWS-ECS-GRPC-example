FROM node:carbon-alpine

WORKDIR /src/app

COPY package*.json ./

RUN npm install

COPY ./src/* ./