const db = require("../config/db");

(async () => {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS pedidos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        usuario_id INT NOT NULL,
        fecha DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS pedido_productos (
        id INT AUTO_INCREMENT PRIMARY KEY,
        pedido_id INT NOT NULL,
        producto_id INT NOT NULL,
        cantidad INT NOT NULL,
        FOREIGN KEY (pedido_id) REFERENCES pedidos(id),
        FOREIGN KEY (producto_id) REFERENCES productos(id)
      )
    `);

    console.log("Tablas creadas o verificadas correctamente.");
  } catch (err) {
    console.error("Error creando tablas:", err);
  }
})();

exports.getPedidos = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM pedidos");
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.getPedidoById = async (req, res) => {
  const { id } = req.params;
  const query = `
    SELECT p.id AS pedido_id, p.usuario_id, p.fecha,
           pr.id AS producto_id, pr.nombre, pr.precio, pp.cantidad
    FROM pedidos p
    JOIN pedido_productos pp ON p.id = pp.pedido_id
    JOIN productos pr ON pp.producto_id = pr.id
    WHERE p.id = ?;
  `;
  try {
    const [results] = await db.query(query, [id]);
    if (results.length === 0) return res.status(404).json({ message: "Pedido no encontrado" });

    const pedido = {
      id: results[0].pedido_id,
      usuario_id: results[0].usuario_id,
      fecha: results[0].fecha,
      productos: results.map(r => ({
        producto_id: r.producto_id,
        nombre: r.nombre,
        precio: r.precio,
        cantidad: r.cantidad
      }))
    };

    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.createPedido = async (req, res) => {
  const { usuario_id, productos } = req.body; 

  if (!usuario_id || !Array.isArray(productos) || productos.length === 0) {
    return res.status(400).json({ error: "usuario_id y productos son requeridos" });
  }

  try {
    const [result] = await db.query("INSERT INTO pedidos (usuario_id) VALUES (?)", [usuario_id]);
    const pedidoId = result.insertId;

    const values = productos.map(p => [pedidoId, p.producto_id, p.cantidad]);
    await db.query("INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES ?", [values]);

    res.status(201).json({ message: "Pedido creado", pedido_id: pedidoId });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};

exports.deletePedido = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM pedido_productos WHERE pedido_id = ?", [id]);
    await db.query("DELETE FROM pedidos WHERE id = ?", [id]);
    res.json({ message: "Pedido eliminado" });
  } catch (err) {
    res.status(500).json({ error: err });
  }
};
