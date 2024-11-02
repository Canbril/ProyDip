// server.js
const express = require('express');
const cors = require('cors');
const keysRoutes = require('./src/routes/keysRoutes'); // Ajusta la ruta

const app = express();
app.use(cors());
app.use(express.json());

// Configuración de rutas
app.use('/api', keysRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
