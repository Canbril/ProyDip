FROM node:latest
WORKDIR /server

COPY . .

RUN npm install
EXPOSE 5000

# Comando para ejecutar la aplicación
CMD ["npm", "start"]