const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuthenticated, authorize } = require('../middleware');

// Obtener todos los médicos con información de usuario
router.get('/', (req, res) => {
  db.query(
    'SELECT usuarios.nombre, usuarios.email, medicos.especialidad, medicos.horario, medicos.contacto FROM medicos JOIN usuarios ON medicos.usuario_id = usuarios.id',
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(results);
    }
  );
});

// Agregar un médico asociado a un usuario existente
router.post('/', (req, res) => {
  const { usuario_id, especialidad, horario, contacto } = req.body;

  db.query(
    'INSERT INTO medicos (usuario_id, especialidad, horario, contacto) VALUES (?, ?, ?, ?)',
    [usuario_id, especialidad, horario, contacto],
    (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      res.status(201).json({ message: 'Médico agregado con éxito' });
    }
  );
});

// Obtener pacientes asignados al médico autenticado
router.get('/pacientes', isAuthenticated, authorize(['medico']), (req, res) => {
  const medicoId = req.session.user.id;

  db.query(
    `SELECT usuarios.nombre, usuarios.email, pacientes.dni, pacientes.historial_clinico, pacientes.contacto_emergencia 
     FROM pacientes 
     JOIN usuarios ON pacientes.usuario_id = usuarios.id
     WHERE pacientes.medico_id = ?`,  // Asumiendo que existe una relación directa
    [medicoId],
    (err, results) => {
      if (err) return res.status(500).json({ error: 'Error al obtener los pacientes' });
      res.json(results);
    }
  );
});

module.exports = router;
