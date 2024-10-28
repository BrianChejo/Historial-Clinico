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

module.exports = router;
