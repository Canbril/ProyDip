// src/routes/files.routes.js
const express = require('express');
const { uploadFile, signFile, verifySignature } = require('../controllers/files.controller');
const authenticateToken = require('../middleware/authMiddleware'); // Importa el middleware

const router = express.Router();

// Usa el middleware de autenticación en las rutas que lo requieren
router.post('/upload', authenticateToken, uploadFile);
router.post('/sign', authenticateToken, signFile);
router.post('/verify', authenticateToken, verifySignature);

module.exports = router;
