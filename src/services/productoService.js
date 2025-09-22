const { Producto } = require("../models/productoModel");

const createProducto = async ({ nombre, precio, stock }) => {
  if (!nombre || precio == null || stock == null) {
    throw new Error("Nombre, precio y stock son requeridos");
  }

  const [result] = await Producto.create(nombre, precio, stock);
  return { id: result.insertId, nombre, precio, stock };
};

module.exports = {
  getProductos: () => Producto.getAll(),
  getProductoById: (id) => Producto.getById(id),
  createProducto,
  deleteProducto: (id) => Producto.delete(id),
};
