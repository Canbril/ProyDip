// src/routes/keysRoutes.js
const express = require('express');
const { generateKeys } = require('../controllers/tasks.controller');
const authenticateToken = require('../middleware/authMiddleware'); // Importa el middleware

const router = express.Router();
router.post('/generate-keys', authenticateToken, generateKeys); // Aplica el middleware

module.exports = router;
