const express = require("express");
const router = express.Router();
const productosController = require("../controllers/productosController");
const { authenticate, authorizeRoles } = require("../middleware/authMiddleware");

router.use(authenticate);

router.get("/", productosController.getProductos);
router.get("/:id", productosController.getProductosById);
router.post("/", authorizeRoles("admin"), productosController.createProductos);
router.delete("/:id", authorizeRoles("admin"), productosController.deleteProductos);

module.exports = router;
