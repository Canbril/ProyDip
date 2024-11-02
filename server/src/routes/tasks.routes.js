const express = require('express');
const router = express.Router();
const tasksController = require('../controllers/tasks.controller');

router.post('/generate-keys', tasksController.generateKeys);

module.exports = router;
