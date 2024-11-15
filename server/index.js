const https = require('https');
const fs = require('fs'); // Asegúrate de requerir 'fs' para leer los certificados
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
// Configuración de dotenv para cargar las variables de entorno
dotenv.config();

// Configuración del certificado SSL
const options = {
    key: fs.readFileSync('../certs/server.key'),  // Ruta a tu clave privada
    cert: fs.readFileSync('../certs/server.cert'),  // Ruta a tu certificado SSL
    // Si tienes un archivo CA (opcional), agrega esta línea:
    // ca: fs.readFileSync('path/to/your/ca_bundle.crt')
};

// Importa las rutas
const userRoutes = require('./src/routes/user.routes');
const taskRoutes = require('./src/routes/tasks.routes');
const fileRoutes = require('./src/routes/files.routes');

// Configuración de middlewares
app.use(cors({
    origin: '*', // Cambia esto al puerto donde corre tu app de React
    credentials: true
}));
app.use(express.json()); // Permite que el cuerpo de las solicitudes se maneje como JSON

// Configuración de las rutas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);

// Configuración de puerto
const PORT = process.env.PORT || 5000;

// Crea el servidor HTTPS
https.createServer(options, app).listen(PORT, () => {
    console.log(`Servidor HTTPS corriendo en el puerto ${PORT}`);
});


