const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los pacientes
router.get('/', (req, res) => {
  db.query('SELECT * FROM pacientes', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un paciente
router.post('/', (req, res) => {
  const { nombre, dni, historial_clinico, contacto_emergencia } = req.body;
  db.query(
    'INSERT INTO pacientes (nombre, dni, historial_clinico, contacto_emergencia) VALUES (?, ?, ?, ?)',
    [nombre, dni, historial_clinico, contacto_emergencia],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Paciente agregado con éxito' });
    }
  );
});

module.exports = router;
