const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];

    if (!token) return res.sendStatus(403); // Forbidden

    jwt.verify(token, 'tu_clave_secreta', (err, user) => { // Asegúrate de que el secreto sea el mismo que usas al firmar el token
        if (err) return res.sendStatus(403); // Forbidden
        req.user = user; // Guarda la información del usuario en la solicitud
        next();
    });
};

module.exports = authenticateToken;
