const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre, email, password, rol = 'paciente', dni, especialidad, horario, contacto, contacto_emergencia } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Crear el usuario en la tabla `usuarios`
    db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });

        const userId = results.insertId;

        // Insertar en la tabla correspondiente según el rol
        if (rol === 'paciente') {
          db.query(
            'INSERT INTO pacientes (usuario_id, dni, historial_clinico, contacto_emergencia) VALUES (?, ?, ?, ?)',
            [userId, dni, null, contacto_emergencia],
            (err) => {
              if (err) return res.status(500).json({ error: 'Error al registrar paciente' });
              res.status(201).json({ message: 'Registro de paciente exitoso' });
            }
          );
        } else if (rol === 'medico') {
          db.query(
            'INSERT INTO medicos (usuario_id, especialidad, horario, contacto) VALUES (?, ?, ?, ?)',
            [userId, especialidad, horario, contacto],
            (err) => {
              if (err) return res.status(500).json({ error: 'Error al registrar medico' });
              res.status(201).json({ message: 'Registro de medico exitoso' });
            }
          );
        } else {
          // Para administradores u otros roles sin tabla específica
          res.status(201).json({ message: 'Registro exitoso' });
        }
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Login de usuario
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  db.query('SELECT * FROM usuarios WHERE email = ?', [email], async (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al buscar usuario' });
    if (results.length === 0) return res.status(401).json({ error: 'Usuario no encontrado' });

    const user = results[0];
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      req.session.user = { id: user.id, rol: user.rol }; // Guardar en la sesión
      res.json({ message: 'Inicio de sesión exitoso', rol: user.rol });
    } else {
      res.status(401).json({ error: 'Contraseña incorrecta' });
    }
  });
});

module.exports = router;
