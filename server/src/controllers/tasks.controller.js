const crypto = require('crypto');
const pool = require('../db');

exports.generateKeys = async (req, res) => {
    const { username } = req.body; // Cambia alias a username

    // Validación de que el username esté presente
    if (!username) {
        return res.status(400).json({ error: 'Username es requerido' });
    }

    // Generación de las llaves pública y privada
    const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: { type: 'spki', format: 'pem' },
        privateKeyEncoding: { type: 'pkcs8', format: 'pem' },
    });

    try {
        // Guarda solo la llave pública en la base de datos con username
        await pool.query(
            'INSERT INTO public_key (alias, key_value) VALUES ($1, $2)',
            [username, publicKey] // Cambia alias a username
        );

        // Ofrece la descarga de la llave privada como un archivo
        res.attachment('privateKey.pem');
        res.send(privateKey);
    } catch (error) {
        console.error('Error al guardar la llave pública:', error.message);
        res.status(500).json({ error: 'Error al guardar la llave pública' });
    }
};
