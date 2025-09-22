const productoService = require("../services/productoService");

exports.getProductos = async (req, res) => {
  try {
    const [results] = await productoService.getProductos();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getProductosById = async (req, res) => {
  try {
    const [result] = await productoService.getProductoById(req.params.id);
    if (!result.length) return res.status(404).json({ message: "Producto no encontrado" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createProductos = async (req, res) => {
  try {
    const producto = await productoService.createProducto(req.body);
    res.status(201).json(producto);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteProductos = async (req, res) => {
  try {
    const [result] = await productoService.deleteProducto(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Producto no encontrado" });
    res.json({ message: "Producto eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
