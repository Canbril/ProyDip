FROM node:latest

WORKDIR /client

COPY package*.json .
COPY src/ ./src/

RUN npm install

ENTRYPOINT ["npm start"]
