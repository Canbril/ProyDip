// server.js
const express = require('express');
const cors = require('cors');
const keysRoutes = require('./src/routes/keysRoutes'); 
const userRoutes = require('./src/routes/user.routes');
const filesRoutes = require('./src/routes/files.routes');

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de rutas
app.use('/api', keysRoutes);
app.use('/api/users', userRoutes);
app.use('/api/files', filesRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
