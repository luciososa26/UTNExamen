const { Pedido } = require("../models/pedidoModel");

const getPedidos = () => Pedido.getAll();

const getPedidoById = async (id) => {
  const [results] = await Pedido.getByIdWithProductos(id);
  if (results.length === 0) return null;

  return {
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
};

const createPedido = async ({ usuario_id, productos }) => {
  if (!usuario_id || !Array.isArray(productos) || productos.length === 0) {
    throw new Error("usuario_id y productos son requeridos");
  }

  const [result] = await Pedido.createPedido(usuario_id);
  const pedidoId = result.insertId;

  const values = productos.map(p => [pedidoId, p.producto_id, p.cantidad]);
  await Pedido.addProductos(values);

  return { pedido_id: pedidoId, productos };
};

const deletePedido = async (id) => {
  await Pedido.deletePedidoProductos(id);
  await Pedido.deletePedido(id);
  return { message: "Pedido eliminado" };
};

module.exports = { getPedidos, getPedidoById, createPedido, deletePedido };
