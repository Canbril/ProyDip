const express = require('express');
const router = express.Router();

const { generateKeys } = require('../controllers/tasks.controller');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// Ruta para generar llaves (requiere autenticación)
router.post('/generate-keys', authenticateJWT, generateKeys);

module.exports = router;
