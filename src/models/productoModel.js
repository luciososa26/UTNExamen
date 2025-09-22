const db = require("../config/db");

const createTable = async () => {
  try {
    await db.query("USE UTNExamen");
    await db.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0
      )
    `);
    console.log("Tabla productos creada/verificada correctamente.");
  } catch (err) {
    console.error("Error creando/verificando tabla productos:", err);
  }
};

const Producto = {
  getAll: () => db.query("SELECT * FROM productos"),
  getById: (id) => db.query("SELECT * FROM productos WHERE id = ?", [id]),
  create: (nombre, precio, stock) =>
    db.query("INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)", [
      nombre,
      precio,
      stock,
    ]),
  delete: (id) => db.query("DELETE FROM productos WHERE id = ?", [id]),
};

module.exports = { Producto, createTable };
