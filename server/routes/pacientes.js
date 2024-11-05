const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todos los pacientes con información de usuario
router.get('/', (req, res) => {
  db.query(
    'SELECT usuarios.nombre, usuarios.email, pacientes.dni, pacientes.historial_clinico, pacientes.contacto_emergencia FROM pacientes JOIN usuarios ON pacientes.usuario_id = usuarios.id',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Agregar un paciente asociado a un usuario existente
router.post('/', (req, res) => {
  const { usuario_id, dni, historial_clinico, contacto_emergencia } = req.body;

  db.query(
    'INSERT INTO pacientes (usuario_id, dni, historial_clinico, contacto_emergencia) VALUES (?, ?, ?, ?)',
    [usuario_id, dni, historial_clinico, contacto_emergencia],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Paciente agregado con éxito' });
    }
  );
});

module.exports = router;
