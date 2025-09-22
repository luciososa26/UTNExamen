const pedidoService = require("../services/pedidoService");

exports.getPedidos = async (req, res) => {
  try {
    const [results] = await pedidoService.getPedidos();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getPedidoById = async (req, res) => {
  try {
    const pedido = await pedidoService.getPedidoById(req.params.id);
    if (!pedido) return res.status(404).json({ message: "Pedido no encontrado" });
    res.json(pedido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createPedido = async (req, res) => {
  try {
    const pedido = await pedidoService.createPedido(req.body);
    res.status(201).json({ message: "Pedido creado", ...pedido });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deletePedido = async (req, res) => {
  try {
    const result = await pedidoService.deletePedido(req.params.id);
    res.json(result);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
