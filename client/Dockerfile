FROM node:latest AS builder

WORKDIR /client

COPY . .

RUN npm install; \
    npm run build

# nginx
FROM nginx:latest

COPY --from=builder /client/build/ /usr/share/nginx/html
ADD default.conf /etc/nginx/conf.d/

EXPOSE 443