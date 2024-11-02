<<<<<<< HEAD
# Usa la imagen de Node.js
FROM node:16

# Crea el directorio de la aplicación
WORKDIR /app

# Copia los archivos de package.json y package-lock.json
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto de los archivos de la aplicación
COPY . .

# Expone el puerto 3000
EXPOSE 3000

# Comando para iniciar la aplicación
=======
FROM node:latest

WORKDIR /client

COPY . .

RUN npm install

EXPOSE 3000
# Comando para ejecutar la aplicación
>>>>>>> 81e731335861a9c1f4fe8b8d4d3d41a4eaf1308d
CMD ["npm", "start"]
