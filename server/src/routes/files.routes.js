const express = require('express');
const router = express.Router();
const { uploadFile, signFile, verifySignature } = require('../controllers/files.controller');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// Ruta para subir archivos (requiere autenticación)
router.post('/upload', authenticateJWT, uploadFile);

// Ruta para firmar archivos (requiere autenticación)
router.post('/sign', authenticateJWT, signFile);

// Ruta para verificar la firma (requiere autenticación)
router.post('/verify', authenticateJWT, verifySignature);

module.exports = router;
