const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los turnos
router.get('/', (req, res) => {
  db.query('SELECT * FROM turnos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un turno
router.post('/', (req, res) => {
  const { paciente_id, medico_id, fecha, hora } = req.body;
  db.query(
    'INSERT INTO turnos (paciente_id, medico_id, fecha, hora) VALUES (?, ?, ?, ?)',
    [paciente_id, medico_id, fecha, hora],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Turno agregado con éxito' });
    }
  );
});

module.exports = router;
