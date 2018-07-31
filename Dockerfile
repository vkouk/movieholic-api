FROM node:8.11.3

WORKDIR /usr/src/movieholic-api

COPY ./ ./

RUN npm install

CMD ["/bin/bash"]
