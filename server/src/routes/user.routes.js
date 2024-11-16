
const express = require('express');
const router = express.Router();
const { register, loginGoole, login, logout } = require('../controllers/user.controller');

// Ruta para registrar un usuario
router.post('/register', register);

// Ruta para iniciar sesión de autenticación con google
router.post('/google-login', loginGoole);

// Ruta para iniciar sesión
router.post('/login', login);

// Ruta para cerrar sesión
router.post('/logout', logout);

module.exports = router;
