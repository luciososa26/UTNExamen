const db = require("../config/db");

(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        nombre VARCHAR(100) NOT NULL,
        precio DECIMAL(10,2) NOT NULL,
        stock INT DEFAULT 0
      );
    `);
    console.log("Tabla productos creada o verificada correctamente.");
  } catch (err) {
    console.error("Error creando tabla productos:", err);
  }
})();

exports.getProductos = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM productos");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getProductosById = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("SELECT * FROM productos WHERE id = ?", [id]);
    if (!result.length) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.createProductos = async (req, res) => {
  const { nombre, precio, stock } = req.body;
  if (!nombre || precio == null || stock == null) {
    return res.status(400).json({ error: "Nombre, precio y stock son requeridos" });
  }

  try {
    const [result] = await db.query(
      "INSERT INTO productos (nombre, precio, stock) VALUES (?, ?, ?)",
      [nombre, precio, stock]
    );
    res.status(201).json({ id: result.insertId, nombre, precio, stock });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deleteProductos = async (req, res) => {
  const { id } = req.params;
  try {
    const [result] = await db.query("DELETE FROM productos WHERE id = ?", [id]);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
