// server/server.js
const express = require('express');
const path = require('path');
const session = require('express-session');
const cors = require('cors');
const { isAuthenticated, authorize } = require('./middleware');
const usuariosRoutes = require('./routes/usuarios');
const medicosRoutes = require('./routes/medicos');
const pacientesRoutes = require('./routes/pacientes');
const turnosRoutes = require('./routes/turnos');
const productosRoutes = require('./routes/productos');
const recordatoriosRoutes = require('./routes/recordatorios');

const app = express();
const port = 3000;

// Configuración de CORS
app.use(cors());

// Configuración de sesiones
app.use(session({
  secret: 'mi_secreto_secreto',
  resave: false,
  saveUninitialized: false,  // Cambiado a false para que se guarde solo con datos
  cookie: { secure: false }   // Cambiar a true si usas HTTPS
}));

// Configurar Express para procesar JSON y archivos estáticos
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));

// Ruta pública para la página principal
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/app.html'));
});

// Rutas públicas (sin restricciones)
app.use('/usuarios', usuariosRoutes);

// Rutas protegidas con restricciones de rol
app.use('/productos', isAuthenticated, authorize(['medico', 'administrador']), productosRoutes);
app.use('/medicos', isAuthenticated, authorize(['medico']), medicosRoutes);
app.use('/pacientes', isAuthenticated, authorize(['paciente', 'administrador']), pacientesRoutes);
app.use('/turnos', isAuthenticated, authorize(['paciente', 'administrador', 'medico']), turnosRoutes);
app.use('/recordatorios', isAuthenticated, authorize(['paciente']), recordatoriosRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
