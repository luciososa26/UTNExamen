const bcrypt = require("bcrypt");
const { Usuario } = require("../models/usuarioModel");

const createUsuario = async ({ nombre, email, password, rol }) => {
  if (!nombre || !email || !password) {
    throw new Error("Nombre, email y password son requeridos");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const [result] = await Usuario.create(nombre, email, hashedPassword, rol);

  return {
    id: result.insertId,
    nombre,
    email,
    rol: rol || "user",
  };
};

module.exports = {
  getUsuarios: () => Usuario.getAll(),
  getUsuarioById: (id) => Usuario.getById(id),
  createUsuario,
  deleteUsuario: (id) => Usuario.delete(id),
  getUsuariosConPedidos: () => Usuario.getUsuariosConPedidos(),
  getTopUsuarios: () => Usuario.getTopUsuarios(),
};
