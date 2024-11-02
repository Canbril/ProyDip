const pool = require('../db'); // Conexión a la base de datos PostgreSQL
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SECRET_KEY = 'tu_clave_secreta'; // Cambia esta clave a una más segura

// Registro de usuarios
exports.register = async (req, res) => {
    const { username, email, password } = req.body;

    // Validar que los datos requeridos estén presentes
    if (!username || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Hash de la contraseña
        const hashedPassword = await bcrypt.hash(password, 10);

        // Insertar usuario en la base de datos
        const result = await pool.query(
            `INSERT INTO users (username, email, user_pass, auth_provider) VALUES ($1, $2, $3, 'email') RETURNING id, username, email`,
            [username, email, hashedPassword]
        );

        res.status(201).json({ message: 'Usuario registrado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error en el registro:', error.message);
        res.status(500).json({ error: 'Error al registrar el usuario' });
    }
};

// Inicio de sesión
exports.login = async (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ error: 'Usuario y contraseña son obligatorios' });
    }

    try {
        // Buscar el usuario en la base de datos
        const result = await pool.query(`SELECT * FROM users WHERE username = $1`, [username]);
        const user = result.rows[0];

        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        // Verificar la contraseña
        const isValidPassword = await bcrypt.compare(password, user.user_pass);
        if (!isValidPassword) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Crear token JWT
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY, { expiresIn: '1h' });

        res.json({ message: 'Inicio de sesión exitoso', token });
    } catch (error) {
        console.error('Error en el inicio de sesión:', error.message);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
};
