const usuarioService = require("../services/usuarioService");

exports.getUsuarios = async (req, res) => {
  try {
    const [results] = await usuarioService.getUsuarios();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsuariosById = async (req, res) => {
  try {
    const [result] = await usuarioService.getUsuarioById(req.params.id);
    if (!result.length) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(result[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.createUsuarios = async (req, res) => {
  try {
    const usuario = await usuarioService.createUsuario(req.body);
    res.status(201).json(usuario);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteUsuarios = async (req, res) => {
  try {
    const [result] = await usuarioService.deleteUsuario(req.params.id);
    if (result.affectedRows === 0) return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getUsuariosConCantidadPedidos = async (req, res) => {
  try {
    const [results] = await usuarioService.getUsuariosConPedidos();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getTopUsuarios = async (req, res) => {
  try {
    const [results] = await usuarioService.getTopUsuarios();
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
