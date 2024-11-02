FROM node:latest

WORKDIR /client

COPY package*.json .
COPY src/ ./src/
COPY public/ ./public/

RUN npm install

ENTRYPOINT ["npm start"]
