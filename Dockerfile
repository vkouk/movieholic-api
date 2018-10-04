FROM node:10.11.0

RUN mkdir -p /usr/src/movieholic-api
WORKDIR /usr/src/movieholic-api

COPY package.json /usr/src/movieholic-api
RUN npm install

COPY . /usr/src/movieholic-api

ARG NODE_VERSION=10.11.0

ENV NODE_VERSION $NODE_VERSION
