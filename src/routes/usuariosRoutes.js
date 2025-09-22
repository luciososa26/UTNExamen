const express = require("express");
const router = express.Router();
const usuariosController = require('../controllers/usuariosController');
const { authenticate, authorizeRoles} = require('../middleware/authMiddleware');

router.use(authenticate);

router.get("/", usuariosController.getUsuarios);
router.get("/:id", usuariosController.getUsuariosById);
router.post("/", authorizeRoles("superAdmin"), usuariosController.createUsuarios);
router.delete("/:id", authorizeRoles("superAdmin"), usuariosController.deleteUsuarios);
router.get("/reportes/cantidad-pedidos", usuariosController.getUsuariosConCantidadPedidos)
router.get("/reportes/top-usuarios", usuariosController.getTopUsuarios)

module.exports = router;
