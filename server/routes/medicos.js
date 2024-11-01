const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los médicos
router.get('/', (req, res) => {
  db.query('SELECT * FROM medicos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un médico
router.post('/', (req, res) => {
  const { nombre, especialidad, horario, contacto } = req.body;
  db.query(
    'INSERT INTO medicos (nombre, especialidad, horario, contacto) VALUES (?, ?, ?, ?)',
    [nombre, especialidad, horario, contacto],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Médico agregado con éxito' });
    }
  );
});
// Obtener pacientes de un médico específico
router.get('/pacientes', (req, res) => {
  const medicoId = req.session.user.id; // Suponiendo que el ID del médico está en la sesión del usuario

  db.query(
    'SELECT * FROM pacientes WHERE medico_id = ?',
    [medicoId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener los pacientes' });
      res.json(results);
    }
  );
});


module.exports = router;
