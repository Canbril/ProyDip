const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const tasksController = require('../controllers/tasks.controller');

router.post('/generate-keys', tasksController.generateKeys);
=======
const { generateKeys } = require('../controllers/tasks.controller');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// Ruta para generar llaves (requiere autenticación)
router.post('/generate-keys', authenticateJWT, generateKeys);
>>>>>>> ramaCarlos

module.exports = router;
