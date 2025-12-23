/**
 * Middleware para verificar permissões por role
 * @param  {...string} allowedRoles - roles permitidas
 */
function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    const user = req.user; // definido pelo middleware de autenticação
    if (!user) return res.status(401).json({ error: 'Usuário não autenticado' });

    if (!allowedRoles.includes(user.role))
      return res.status(403).json({ error: 'Acesso negado: role insuficiente' });

    next();
  };
}

module.exports = { authorizeRoles };