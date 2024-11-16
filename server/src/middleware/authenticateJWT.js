const jwt = require('jsonwebtoken');
const { isTokenRevoked } = require('../controllers/user.controller');
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret';

// Middleware de autenticación JWT
const authenticateJWT = async (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Obtiene el token desde el header Authorization
    
    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    // Verificación si el token ha sido revocado
    if (await isTokenRevoked(token)) {
        return res.status(401).json({ error: 'Token revocado' });
    }

    try {
        // Verifica el token
        const decoded = jwt.verify(token, SECRET_KEY); // Esto lanzará un error si el token no es válido o ha expirado

        // Verificar si el id del usuario en el token corresponde al id del usuario que hace la solicitud
        if (req.body.username && req.body.username !== decoded.username) {
            return res.status(403).json({ error: 'El token no corresponde a este usuario.' });
        }

        req.user = decoded; // Agrega el usuario a la solicitud
        next(); // Continúa con la siguiente función
    } catch (err) {
        // Manejo de errores más detallado
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ error: 'Token expirado.' });
        }
        return res.status(403).json({ error: 'Token no válido o de formato incorrecto.' });
    }
};

module.exports = { authenticateJWT };