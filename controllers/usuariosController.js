const db = require("../config/db");

(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        rol ENUM('superAdmin','admin','user'),
        password VARCHAR(255) NOT NULL
      );
    `);
    console.log("Tabla usuarios creada o verificada correctamente.");
  } catch (err) {
    console.error("Error creando tabla usuarios:", err);
  }
})();

exports.getUsuarios = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM usuarios");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getUsuariosById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM usuarios WHERE id = ?", [id]);
    if (!result.length) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.createUsuarios = async (req, res) => {
  const { nombre, email } = req.body;
  if (!nombre || !email) {
    return res.status(400).json({ error: "Nombre y email son requeridos" });
  }

  try {
    const hashedPassword = await bycrypt.hash(password, 10);
    const [result] = await db.query(
      "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
      [nombre, email, hashedPassword, rol || "user"]
    );
    res.status(201).json({ id: result.insertId, nombre, email, rol: rol || "user" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteUsuarios = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM usuarios WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getUsuariosConCantidadPedidos = async (req, res) => {
  const query = `
    SELECT 
      u.id,
      u.nombre,
      u.email,
      COUNT(p.id) AS cantidad_pedidos
    FROM usuarios u
    LEFT JOIN pedidos p ON p.usuario_id = u.id
    GROUP BY u.id, u.nombre, u.email
    ORDER BY cantidad_pedidos DESC;
  `;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener usuarios con cantidad de pedidos" });
  } 
};

exports.getTopUsuarios = async (req, res) => {
  const query = `
    SELECT u.id, u.nombre, COUNT(p.id) AS total_pedidos
    FROM usuarios u
    JOIN pedidos p ON u.id = p.usuario_id
    GROUP BY u.id
    ORDER BY total_pedidos DESC
    LIMIT 5;
  `;
  try {
    const [results] = await db.query(query);
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error al obtener los mejores 5 usuarios" });
  }
}
