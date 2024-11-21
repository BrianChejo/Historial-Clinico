const express = require('express');
const router = express.Router();
const db = require('../db');
const { isAuthenticated, authorize } = require('../middleware');

// Obtener todos los pacientes (solo accesible para usuarios con rol 'medico')
router.get('/todos', isAuthenticated, authorize(['medico']), (req, res) => {
  const usuario_id = req.user.id;  // Suponiendo que el ID del usuario autenticado esté en `req.user.id`

  // Query para obtener los pacientes del médico autenticado
  db.query(
    `SELECT usuarios.nombre, usuarios.email, pacientes.dni, pacientes.historial_clinico, pacientes.contacto_emergencia
     FROM pacientes
     JOIN usuarios ON pacientes.usuario_id = usuarios.id
     WHERE usuarios.id = ?`,  // Corregido: ahora se busca solo por el médico autenticado
    [usuario_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(404).json({ error: 'No se encontraron pacientes para este médico' });
      }
      res.json(results);
    }
  );
});

// Agregar un paciente asociado a un usuario existente
router.post('/', isAuthenticated, authorize(['admin', 'medico']), (req, res) => {
  const { usuario_id, dni, historial_clinico, contacto_emergencia } = req.body;

  // Verificar si el usuario es un médico antes de agregar un paciente
  db.query(
    'SELECT * FROM medicos WHERE usuario_id = ?',
    [usuario_id],
    (err, results) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      if (results.length === 0) {
        return res.status(400).json({ error: 'El usuario no es un médico' });
      }

      // Si es un médico, insertar el paciente
      db.query(
        'INSERT INTO pacientes (usuario_id, dni, historial_clinico, contacto_emergencia) VALUES (?, ?, ?, ?)',
        [usuario_id, dni, historial_clinico, contacto_emergencia],
        (err, results) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ message: 'Paciente agregado con éxito' });
        }
      );
    }
  );
});

module.exports = router;
