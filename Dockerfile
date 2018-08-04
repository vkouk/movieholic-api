FROM node:8.11.3

RUN mkdir -p /usr/src/movieholic-api
WORKDIR /usr/src/movieholic-api

COPY package.json /usr/src/movieholic-api
RUN npm install

COPY . /usr/src/movieholic-api

ARG NODE_VERSION=8.11.3

ENV NODE_VERSION $NODE_VERSION
