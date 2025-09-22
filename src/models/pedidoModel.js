const db = require("../config/db");

const createTable = async () => {
  try {
    await db.query("USE UTNExamen");

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

    console.log("Tablas pedidos y pedido_productos creadas/verificadas correctamente.");
  } catch (err) {
    console.error("Error creando/verificando tablas pedidos:", err);
  }
};

const Pedido = {
  getAll: () => db.query("SELECT * FROM pedidos"),
  getByIdWithProductos: (id) =>
    db.query(
      `
      SELECT p.id AS pedido_id, p.usuario_id, p.fecha,
             pr.id AS producto_id, pr.nombre, pr.precio, pp.cantidad
      FROM pedidos p
      JOIN pedido_productos pp ON p.id = pp.pedido_id
      JOIN productos pr ON pp.producto_id = pr.id
      WHERE p.id = ?;
      `,
      [id]
    ),
  createPedido: (usuario_id) => db.query("INSERT INTO pedidos (usuario_id) VALUES (?)", [usuario_id]),
  addProductos: (values) => db.query("INSERT INTO pedido_productos (pedido_id, producto_id, cantidad) VALUES ?", [values]),
  deletePedidoProductos: (pedidoId) => db.query("DELETE FROM pedido_productos WHERE pedido_id = ?", [pedidoId]),
  deletePedido: (pedidoId) => db.query("DELETE FROM pedidos WHERE id = ?", [pedidoId]),
};

module.exports = { Pedido, createTable };
