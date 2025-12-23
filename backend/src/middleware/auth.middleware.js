const jwt = require('jsonwebtoken');

/**
 * Middleware para autenticação via JWT
 */
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) return res.status(401).json({ error: 'Token não fornecido' });

  const [scheme, token] = authHeader.split(' ');

  if (scheme !== 'Bearer' || !token) return res.status(401).json({ error: 'Token malformado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};