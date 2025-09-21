const express = require("express");
const router = express.Router();
const { getProductos, getProductosById, createProductos, deleteProductos } = require("../controllers/productosController");

router.get("/", getProductos);
router.get("/:id", getProductosById);
router.post("/", createProductos);
router.delete("/:id", deleteProductos);

module.exports = router;
