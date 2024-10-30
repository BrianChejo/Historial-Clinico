// server/routes/usuarios.js
const express = require('express');
const bcrypt = require('bcryptjs');
const db = require('../db');
const router = express.Router();

// Registro de usuario
router.post('/registro', async (req, res) => {
  const { nombre, email, password, rol = 'paciente' } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    db.query(
      'INSERT INTO usuarios (nombre, email, password, rol) VALUES (?, ?, ?, ?)',
      [nombre, email, hashedPassword, rol],
      (err, results) => {
        if (err) return res.status(500).json({ error: 'Error al registrar usuario' });
        res.status(201).json({ message: 'Registro exitoso' });
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
