const db = require('../config/db');
const bcrypt = require('bcrypt');
const { generateToken } = require('../utils/jwt');

exports.register = async (req, res) => {
    const { nombre, email, password, rol } = req.body;
    if (!nombre || !email || !password) {
        return res.status(400).json({ error: 'Todos los campos son requeridos' });
    }

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const [result] = await db.query(
            "INSERT INTO usuarios (nombre, email, rol, password) VALUES (?, ?, ?, ?)",
            [nombre, email, rol || 'user', hashedPassword]
        );
        res.status(201).json({ message: 'Usuario registrado correctamente', userId: result.insertId });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            res.status(400).json({ error: 'Email ya registrado' });
        } else {
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    }
};

exports.login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Email y password son requeridos' });

    try {
        const [rows] = await db.query("SELECT * FROM usuarios WHERE email = ?", [email]);
        if (rows.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

        const user = rows[0];
        const isValid = await bcrypt.compare(password, user.password);
        if (!isValid) return res.status(401).json({ error: 'Contraseña incorrecta' });

        const token = generateToken({ id: user.id, rol: user.rol });
        res.json({ token });
    } catch (err) {
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};
