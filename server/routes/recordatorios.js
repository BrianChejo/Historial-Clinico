const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los recordatorios
router.get('/', (req, res) => {
  db.query('SELECT * FROM recordatorios', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un recordatorio
router.post('/', (req, res) => {
  const { paciente_id, producto_id, tipo, fecha, hora } = req.body;
  db.query(
    'INSERT INTO recordatorios (paciente_id, producto_id, tipo, fecha, hora) VALUES (?, ?, ?, ?, ?)',
    [paciente_id, producto_id, tipo, fecha, hora],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Recordatorio agregado con éxito' });
    }
  );
});

module.exports = router;
