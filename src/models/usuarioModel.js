const db = require("../config/db");
const bcrypt = require("bcrypt");

const createTable = async () => {
  try {
    await db.query("CREATE DATABASE IF NOT EXISTS UTNExamen");
    await db.query("USE UTNExamen");

    await db.query(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        rol ENUM('superAdmin','admin','user') DEFAULT 'user',
        password VARCHAR(255) NOT NULL
      )
    `);

    const [rows] = await db.query("SELECT * FROM usuarios WHERE rol = 'superAdmin' LIMIT 1");
    if (rows.length === 0) {
      const hashedPassword = await bcrypt.hash("superadmin123", 10);
      await db.query(
        "INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)",
        ["Super Admin", "superadmin@gmail.com", hashedPassword, "superAdmin"]
      );
      console.log("superAdmin creado correctamente.");
    } else {
      console.log("superAdmin ya existe.");
    }

    console.log("Tabla usuarios creada/verificada correctamente.");
  } catch (err) {
    console.error("Error creando/verificando tabla usuarios:", err);
  }
};

const Usuario = {
  getAll: () => db.query("SELECT * FROM usuarios"),
  getById: (id) => db.query("SELECT * FROM usuarios WHERE id = ?", [id]),
  create: (nombre, email, password, rol = "user") =>
    db.query("INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)", [
      nombre,
      email,
      password,
      rol,
    ]),
  delete: (id) => db.query("DELETE FROM usuarios WHERE id = ?", [id]),
  getUsuariosConPedidos: () =>
    db.query(`
      SELECT u.id, u.nombre, COUNT(p.id) as cantidad_pedidos
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.usuario_id
      GROUP BY u.id
    `),
  getTopUsuarios: () =>
    db.query(`
      SELECT u.id, u.nombre, COUNT(p.id) as cantidad_pedidos
      FROM usuarios u
      LEFT JOIN pedidos p ON u.id = p.usuario_id
      GROUP BY u.id
      ORDER BY cantidad_pedidos DESC
      LIMIT 5
    `),
};

module.exports = { Usuario, createTable };
