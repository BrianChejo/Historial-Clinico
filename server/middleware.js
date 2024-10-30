// server/middleware.js

// Middleware para verificar si el usuario está autenticado
function isAuthenticated(req, res, next) {
    if (req.session && req.session.user) {
      return next();
    }
    return res.status(401).json({ error: 'Usuario no autenticado' });
  }
  
  // Middleware para verificar si el usuario tiene el rol necesario
  function authorize(roles) {
    return (req, res, next) => {
      if (req.session && roles.includes(req.session.user.rol)) {
        return next();
      }
      return res.status(403).json({ error: 'No tienes permiso para acceder a esta página' });
    };
  }
  
  module.exports = { isAuthenticated, authorize };
  