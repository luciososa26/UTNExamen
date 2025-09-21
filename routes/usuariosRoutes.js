const express = require("express");
const router = express.Router();
const { getUsuarios, getUsuariosById, createUsuarios, deleteUsuarios, getUsuariosConCantidadPedidos, getTopUsuarios } = require("../controllers/usuariosController");

router.get("/", getUsuarios);
router.get("/:id", getUsuariosById);
router.post("/", createUsuarios);
router.delete("/:id", deleteUsuarios);
router.get("/reportes/cantidad-pedidos", getUsuariosConCantidadPedidos)
router.get("/reportes/top-usuarios", getTopUsuarios)

module.exports = router;
