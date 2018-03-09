FROM node:carbon-alpine

RUN apk add --no-cache make gcc g++ python

WORKDIR /src/app

COPY package*.json ./

RUN npm install
RUN npm rebuild

ADD . /src/app