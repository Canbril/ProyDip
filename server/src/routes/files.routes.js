const express = require('express');
const router = express.Router();
const { uploadFile, getUserFiles, signFile, verifySignature, getUserSignatures, shareFile, getUsers, signSharedFile} = require('../controllers/files.controller');
const { authenticateJWT } = require('../middleware/authenticateJWT');

// Rutas protegidas
router.post('/upload', authenticateJWT, uploadFile);
router.get('/user-files', authenticateJWT, getUserFiles);
router.post('/sign', authenticateJWT, signFile);
router.post('/verify', authenticateJWT, verifySignature);
router.get('/signatures', authenticateJWT, getUserSignatures);
// Ruta para compartir archivos
router.post('/share', authenticateJWT, shareFile);
router.get('/users', authenticateJWT, getUsers);



module.exports = router;
