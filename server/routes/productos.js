const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM productos', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Agregar un producto
router.post('/', (req, res) => {
  const { nombre, dosis, efectos_secundarios } = req.body;
  db.query(
    'INSERT INTO productos (nombre, dosis, efectos_secundarios) VALUES (?, ?, ?)',
    [nombre, dosis, efectos_secundarios],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Producto agregado con éxito' });
    }
  );
});

module.exports = router;
