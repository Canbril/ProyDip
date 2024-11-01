const crypto = require('crypto');
const pool = require('../db');

exports.generateKeys = async (req, res) => {
  const { alias } = req.body;

  // Validación de que el alias esté presente
  if (!alias) {
    return res.status(400).json({ error: 'Alias es requerido' });
  }

  // Generación de las llaves pública y privada
  const { publicKey, privateKey } = crypto.generateKeyPairSync('rsa', {
    modulusLength: 2048,
    publicKeyEncoding: { type: 'pkcs1', format: 'pem' },
    privateKeyEncoding: { type: 'pkcs1', format: 'pem' },
  });

  try {
    // Guarda solo la llave pública en la base de datos con alias
    await pool.query(
      'INSERT INTO public_key (alias, key_value) VALUES ($1, $2)',
      [alias, publicKey]
    );

    // Ofrece la descarga de la llave privada como un archivo
    res.attachment('privateKey.pem');
    res.send(privateKey);
  } catch (error) {
    console.error('Error al guardar la llave pública:', error.message);
    res.status(500).json({ error: 'Error al guardar la llave pública' });
  }
};
