// server/routes/turnos.js
const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuthenticated, authorize } = require('../middleware');

// Obtener todos los turnos (autenticación requerida)
router.get('/', isAuthenticated, (req, res) => {
  db.query('SELECT * FROM turnos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un turno (autenticación requerida)
router.post('/', isAuthenticated, (req, res) => {
  const { paciente_id, medico_id, fecha, hora } = req.body;
  db.query(
    'INSERT INTO turnos (paciente_id, medico_id, fecha, hora, estado) VALUES (?, ?, ?, ?, "pendiente")',
    [paciente_id, medico_id, fecha, hora],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Turno agregado con éxito' });
    }
  );
});

// Obtener turnos pendientes (autenticación y autorización requerida)
router.get('/pendientes', isAuthenticated, authorize(['medico', 'administrador']), (req, res) => {
  db.query(
    `SELECT t.id, p.nombre AS paciente_nombre, t.fecha, t.hora, t.estado
     FROM turnos t
     JOIN pacientes p ON t.paciente_id = p.id
     WHERE t.estado = 'pendiente'`,
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener los turnos pendientes' });
      res.json(results);
    }
  );
});

// Actualizar el estado de un turno (solo para ciertos roles)
router.put('/:id', isAuthenticated, authorize(['medico', 'administrador']), (req, res) => {
  const turnoId = req.params.id;
  const { estado } = req.body;

  if (!['aprobado', 'rechazado'].includes(estado)) {
    return res.status(400).json({ error: 'Estado no válido' });
  }

  db.query(
    'UPDATE turnos SET estado = ? WHERE id = ?',
    [estado, turnoId],
    (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el turno' });
      res.json({ message: `Turno ${estado} con éxito` });
    }
  );
});

module.exports = router;
