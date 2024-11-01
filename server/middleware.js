// server/middleware.js

function isAuthenticated(req, res, next) {
  if (req.session && req.session.user) {
    return next();
  }
  return res.status(401).json({ error: 'Usuario no autenticado' });
}

function authorize(roles) {
  return (req, res, next) => {
    if (req.session && req.session.user && roles.includes(req.session.user.rol)) {
      return next();
    }
    return res.status(403).json({ error: 'No tienes permiso para acceder a esta página' });
  };
}

module.exports = { isAuthenticated, authorize };
