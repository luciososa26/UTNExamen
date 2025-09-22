const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/jwt");
const authModel = require("../models/authModel");

exports.loginUser = async ({ email, password }) => {
    if (!email || !password) {
        throw { status: 400, message: "Email y password son requeridos" };
    }

    const user = await authModel.getUserByEmail(email);
    if (!user) {
        throw { status: 401, message: "Usuario no encontrado" };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
        throw { status: 401, message: "Contraseña incorrecta" };
    }

    const token = generateToken({ id: user.id, rol: user.rol });
    return { token };
};
