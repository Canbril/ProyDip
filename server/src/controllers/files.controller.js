const crypto = require('crypto');
const pool = require('../db');
const multer = require('multer');

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
