const express = require("express");
const router = express.Router();
const pedidosController = require("../controllers/pedidosController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticate)

router.get("/", authorizeRoles("admin"), pedidosController.getPedidos);
router.get("/:id", authorizeRoles("admin"), pedidosController.getPedidoById);
router.post("/", authorizeRoles("admin", "user"), pedidosController.createPedido);
router.delete("/:id", authorizeRoles("admin"), pedidosController.deletePedido);

module.exports = router;
