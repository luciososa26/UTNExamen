const express = require("express");
const router = express.Router();
const { getPedidos, getPedidoById, createPedido, deletePedido } = require("../controllers/pedidosController");

router.get("/", getPedidos);
router.get("/:id", getPedidoById);
router.post("/", createPedido);
router.delete("/:id", deletePedido);

module.exports = router;
