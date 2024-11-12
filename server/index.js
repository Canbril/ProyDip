const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const app = express();
// Configuración de dotenv para cargar las variables de entorno
dotenv.config();

// Importa las rutas
const userRoutes = require('./src/routes/user.routes');
const taskRoutes = require('./src/routes/tasks.routes');
const fileRoutes = require('./src/routes/files.routes');

// Configuración de middlewares
app.use(cors());
app.use(express.json()); // Permite que el cuerpo de las solicitudes se maneje como JSON

// Configuración de las rutas
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/files', fileRoutes);

// Configuración de puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
