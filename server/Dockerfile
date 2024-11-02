FROM node:latest
WORKDIR /server

COPY . .

RUN npm install
EXPOSE 4000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]