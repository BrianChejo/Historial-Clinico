const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

// Ruta para agregar médicos
app.post('/medicos', (req, res) => {
  const { nombre, especialidad, horario } = req.body;

  // Aquí iría la lógica para guardar al médico en la base de datos

  console.log('Médico registrado:', { nombre, especialidad, horario });
  res.status(201).json({ message: 'Médico registrado con éxito' });
});

// Rutas adicionales para pacientes, turnos, etc.

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
