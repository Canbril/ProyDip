// src/routes/keysRoutes.js

const express = require('express');
const { generateKeys } = require('../controllers/tasks.controller');

const router = express.Router();
router.post('/generate-keys', generateKeys);

module.exports = router;
