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

        console.log('Archivo recibido:', file); // Verifica si se recibe el archivo
        console.log('User ID:', user_id); // Verifica el user_id

        if (!file) return res.status(400).json({ error: 'Archivo es requerido' });

        const hash = crypto.createHash('sha256').update(file.buffer).digest('hex');

        try {
            const result = await pool.query(
                `INSERT INTO archivos_subidos (user_id, nombre_archivo, tamano, tipo_contenido, archivo, hash_archivo, fecha_creacion, es_compartido) 
                 VALUES ($1, $2, $3, $4, $5, $6, CURRENT_TIMESTAMP, false) RETURNING *`,
                [user_id, file.originalname, file.size, file.mimetype, file.buffer, hash]
            );
        
            console.log('Resultado de la inserción:', result.rows[0]); // Verifica el resultado
            
            // Verificar si el archivo realmente se inserta
            const checkResult = await pool.query('SELECT * FROM archivos_subidos WHERE id = $1', [result.rows[0].id]);
            console.log('Verificación de archivo insertado:', checkResult.rows);
        
            res.json({ message: 'Archivo subido exitosamente', archivo: result.rows[0] });
        } catch (error) {
            console.error('Error al subir el archivo:', error);
            res.status(500).json({ error: 'Error al subir el archivo' });
        }        
    }
];


exports.signFile = async (req, res) => {
    const { archivo_id, privateKey } = req.body;
    const user_id = req.user.id; // Obtén el user_id del usuario autenticado

    try {
        // Obtener el archivo de la base de datos
        const result = await pool.query('SELECT archivo FROM archivos_subidos WHERE id = $1', [archivo_id]);
        if (result.rows.length === 0) return res.status(404).json({ error: 'Archivo no encontrado' });

        const archivoBuffer = result.rows[0].archivo;

        // Generar la firma
        const sign = crypto.createSign('SHA256');
        sign.update(archivoBuffer);
        sign.end();
        const signature = sign.sign(privateKey, 'hex');

        // Guardar la firma en la base de datos
        await pool.query(
            `INSERT INTO archivos_firmados (archivo_id, public_key_id, signature) 
             VALUES ($1, (SELECT id FROM public_key WHERE user_id = $2), $3)`,
            [archivo_id, user_id, signature]
        );

        res.json({ message: 'Archivo firmado exitosamente', signature });
    } catch (error) {
        console.error('Error al firmar el archivo:', error);
        res.status(500).json({ error: 'Error al firmar el archivo' });
    }
};

exports.verifySignature = async (req, res) => {
    const { archivo_id, signature } = req.body;

    try {
        // Obtener el archivo y la llave pública
        const result = await pool.query(
            `SELECT archivo, key_value FROM archivos_subidos 
             JOIN public_key ON archivos_subidos.user_id = public_key.user_id 
             WHERE archivos_subidos.id = $1`,
            [archivo_id]
        );

        if (result.rows.length === 0) return res.status(404).json({ error: 'Archivo o llave pública no encontrada' });

        const { archivo, key_value: publicKey } = result.rows[0];

        // Verificar la firma
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
