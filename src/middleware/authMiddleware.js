const { verifyToken } = require('../utils/jwt');

function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: 'Token faltante' });

    const token = authHeader.split(' ')[1];
    const decoded = verifyToken(token);
    
    if (!decoded) return res.status(401).json({ error: 'Token inválido' });

    req.user = decoded; 
    next();
}
function authorizeRoles(...allowedRoles) {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.rol)) {
            return res.status(403).json({ error: 'No autorizado' });
        }
        next();
    };
}

module.exports = { authenticate, authorizeRoles };
