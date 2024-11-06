// src/routes/tasks.routes.js
const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');
const authenticateToken = require('../middleware/authMiddleware'); // Importa el middleware

router.post('/generate-keys', authenticateToken, tasksController.generateKeys); // Aplica el middleware

module.exports = router;
