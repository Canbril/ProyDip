const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET || 'default_secret'; // Asegúrate de usar la variable de entorno

// Middleware de autenticación JWT
const authenticateJWT = (req, res, next) => {
    const token = req.header('Authorization')?.split(' ')[1]; // Obtiene el token desde el header Authorization
    
    if (!token) {
        return res.status(403).json({ error: 'Acceso denegado. No se proporcionó un token.' });
    }

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Token no válido o expirado.' });
        }
        req.user = user; // Agrega el usuario a la solicitud
        next(); // Continúa con la siguiente función
    });
};

module.exports = { authenticateJWT };
