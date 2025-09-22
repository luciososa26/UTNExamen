const authService = require("../services/authService");

exports.login = async (req, res) => {
    try {
        const result = await authService.loginUser(req.body);
        res.json(result);
    } catch (err) {
        res.status(err.status || 500).json({ error: err.message || "Error desconocido" });
    }
};
