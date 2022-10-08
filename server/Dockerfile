FROM node:18-alpine

WORKDIR /app

COPY package.json /app

RUN npm install

COPY ../../AGC-aux-system-ser  .

EXPOSE 8000

VOLUME ["/app/data"]
VOLUME ["/app/files"]

CMD [ "node", "server.js" ]