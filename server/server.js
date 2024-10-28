const express = require('express');
const path = require('path');
const app = express();
const port = 3000;
const cors = require('cors');

// Importar rutas
const medicosRoutes = require('./routes/medicos');
const pacientesRoutes = require('./routes/pacientes');
const turnosRoutes = require('./routes/turnos');
const productosRoutes = require('./routes/productos');
const recordatoriosRoutes = require('./routes/recordatorios');

app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/app.html'));
});

// Usar rutas importadas
app.use('/medicos', medicosRoutes);
app.use('/pacientes', pacientesRoutes);
app.use('/turnos', turnosRoutes);
app.use('/productos', productosRoutes);
app.use('/recordatorios', recordatoriosRoutes);

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
