const crypto = require('crypto');
const pool = require('../db');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Configuración de multer para almacenar archivos en memoria
const upload = multer({ storage: multer.memoryStorage() });

// Middleware de subida de archivos
exports.uploadFile = [
    upload.single('file'),
    async (req, res) => {
        const user_id = req.user.id; // Obtén el user_id del usuario autenticado
        const file = req.file;

        if (!file) return res.status(400).json({ error: 'Archivo es requerido' });

        const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

        try {
            const result = await pool.query(
                `INSERT INTO archivos_subidos (user_id, nombre_archivo, tamano, tipo_contenido, archivo, hash_archivo, fecha_creacion, es_compartido) 
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, false) RETURNING *`,
                [user_id, file.originalname, file.size, file.mimetype, file.buffer, hash]
            );
        
            res.json({ message: 'Archivo subido exitosamente', archivo: result.rows[0] });
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            res.status(500).json({ error: 'Error al subir el archivo' });
        }        
    }
];

// Controlador para obtener los archivos subidos por el usuario autenticado
exports.getUserFiles = async (req, res) => {
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            'SELECT id, nombre_archivo FROM archivos_subidos WHERE user_id = $1',
            [user_id]
        );
        
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los archivos del usuario:', error);
        res.status(500).json({ error: 'Error al obtener los archivos' });
    }
};

exports.signFile = async (req, res) => {
    const { archivo_id, privateKey } = req.body;
    const user_id = req.user.id; // Obtén el user_id del usuario autenticado
    const username = req.user.username; // Asumimos que el username se encuentra en el token

    try {
        // Obtener el archivo de la base de datos
        const result = await pool.query('SELECT archivo FROM archivos_subidos WHERE id = $1', [archivo_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Archivo no encontrado' });

        const archivoBuffer = result.rows[0].archivo;

        // Obtener la llave pública usando el alias (username)
        const publicKeyResult = await pool.query(
            'SELECT key_value FROM public_key WHERE alias = $1', 
            [username]
        );
        
        if (publicKeyResult.rows.length === 0) {
            return res.status(404).json({ error: 'Llave pública no encontrada para el usuario' });
        }

        const publicKey = publicKeyResult.rows[0].key_value;

        // Generar la firma
        const sign = crypto.createSign('SHA256');
        sign.update(archivoBuffer);
        sign.end();
        const signature = sign.sign(privateKey, 'hex');

        // Guardar la firma en la base de datos
        await pool.query(
            `INSERT INTO archivos_firmados (archivo_id, public_key_id, signature, username) 
             VALUES ($1, (SELECT id FROM public_key WHERE alias = $2), $3, $4)`,
            [archivo_id, username, signature, username]
        );

        res.json({ message: 'Archivo firmado exitosamente', signature });
    } catch (error) {
        console.error('Error al firmar el archivo:', error);
        res.status(500).json({ error: 'Error al firmar el archivo' });
    }
};

// Controlador para obtener las firmas del usuario autenticado con el nombre del archivo
exports.getUserSignatures = async (req, res) => {
    const username = req.user.username;

    try {
        const result = await pool.query(
            `SELECT af.id, af.archivo_id, af.signature, af.created_at, a.nombre_archivo
             FROM archivos_firmados af
             JOIN archivos_subidos a ON af.archivo_id = a.id
             WHERE af.username = $1`,
            [username]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener las firmas del usuario:', error);
        res.status(500).json({ error: 'Error al obtener las firmas' });
    }
};

// Controlador para verificar la firma de un archivo
exports.verifySignature = async (req, res) => {
    const { archivo_id, signature } = req.body;

    try {
        // Consulta para obtener el archivo, la llave pública y el hash almacenado
        const result = await pool.query(
            `SELECT a.archivo, a.hash_archivo, pk.key_value 
             FROM archivos_subidos a
             JOIN public_key pk ON pk.id = (
                 SELECT public_key_id FROM archivos_firmados WHERE archivo_id = a.id
             )
             WHERE a.id = $1`,
            [archivo_id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Archivo o llave pública no encontrada' });
        }

        const { archivo, hash_archivo, key_value: publicKey } = result.rows[0];

        // Calcular el hash del archivo en la solicitud y compararlo con el almacenado
        const calculatedHash = crypto.createHash('sha256').update(archivo).digest('hex');
        if (calculatedHash !== hash_archivo) {
            return res.status(400).json({ error: 'El hash del archivo no coincide con el hash almacenado' });
        }

        // Verificar la firma usando la llave pública
        const verify = crypto.createVerify('SHA256');
        verify.update(archivo);
        verify.end();

        const isValid = verify.verify(publicKey, signature, 'hex');
        res.json({ isValid });
    } catch (error) {
        console.error('Error al verificar la firma:', error);
        res.status(500).json({ error: 'Error al verificar la firma' });
    }
};

// Controlador para compartir archivos entre usuarios
exports.shareFile = async (req, res) => {
    const { archivo_id, user_to_share_id, puede_firmar } = req.body;
    const user_id = req.user.id; // El usuario autenticado obtiene su ID desde el token

    if (user_id === user_to_share_id) {
        return res.status(400).json({ error: 'No puedes compartir un archivo contigo mismo.' });
    }

    try {
        // Verificar que el archivo pertenece al usuario autenticado
        const fileResult = await pool.query(
            'SELECT * FROM archivos_subidos WHERE id = $1 AND user_id = $2',
            [archivo_id, user_id]
        );

        if (fileResult.rows.length === 0) {
            return res.status(404).json({ error: 'Archivo no encontrado o no es de tu propiedad.' });
        }

        // Verificar que el usuario a quien se quiere compartir el archivo existe
        const userResult = await pool.query('SELECT id FROM users WHERE id = $1', [user_to_share_id]);
        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        // Insertar en la tabla de archivos compartidos
        await pool.query(
            `INSERT INTO archivos_compartidos (archivo_id, user_id, puede_firmar, firmado) 
             VALUES ($1, $2, $3, false)`,
            [archivo_id, user_to_share_id, puede_firmar]
        );

        res.json({ message: 'Archivo compartido exitosamente.' });
    } catch (error) {
        console.error('Error al compartir el archivo:', error);
        res.status(500).json({ error: 'Error al compartir el archivo.' });
    }
};

// Controlador para obtener la lista de usuarios (excluyendo al usuario autenticado)
exports.getUsers = async (req, res) => {
    const user_id = req.user.id; // ID del usuario autenticado

    try {
        const result = await pool.query(
            `SELECT id, username FROM users WHERE id != $1 ORDER BY username`,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener la lista de usuarios:', error);
        res.status(500).json({ error: 'Error al obtener la lista de usuarios.' });
    }
};

// Controlador para obtener los archivos compartidos con el usuario autenticado
exports.getSharedFiles = async (req, res) => {
    const user_id = req.user.id;

    try {
        const result = await pool.query(
            `SELECT a.id, a.nombre_archivo
             FROM archivos_subidos a
             JOIN archivos_compartidos ac ON ac.archivo_id = a.id
             WHERE ac.user_id = $1`,
            [user_id]
        );

        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener los archivos compartidos:', error);
        res.status(500).json({ error: 'Error al obtener los archivos compartidos' });
    }
};
