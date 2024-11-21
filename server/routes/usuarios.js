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

// Actualizar rol de usuario
router.put('/actualizar-rol/:id', (req, res) => {
  const usuarioId = req.params.id;
  const { nuevoRol } = req.body;

  // Obtener el rol actual del usuario
  db.query('SELECT rol FROM usuarios WHERE id = ?', [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const rolActual = results[0].rol;

    // Actualizar el rol en la tabla usuarios
    db.query('UPDATE usuarios SET rol = ? WHERE id = ?', [nuevoRol, usuarioId], (err) => {
      if (err) return res.status(500).json({ error: 'Error al actualizar el rol' });

      // Lógica para manejar el cambio de rol
      if (rolActual === 'paciente' && nuevoRol === 'medico') {
        // Mover de pacientes a medicos
        db.query('DELETE FROM pacientes WHERE usuario_id = ?', [usuarioId], (err) => {
          if (err) return res.status(500).json({ error: 'Error al eliminar de pacientes' });

          // Agregar a la tabla medicos
          const medico = { usuario_id: usuarioId, especialidad: '', horario: '', contacto: '' }; // Datos iniciales
          db.query('INSERT INTO medicos SET ?', medico, (err) => {
            if (err) return res.status(500).json({ error: 'Error al agregar a medicos' });
            res.json({ message: 'Rol actualizado y datos movidos a medicos' });
          });
        });
      } else if (rolActual === 'medico' && nuevoRol === 'paciente') {
        // Mover de medicos a pacientes
        db.query('DELETE FROM medicos WHERE usuario_id = ?', [usuarioId], (err) => {
          if (err) return res.status(500).json({ error: 'Error al eliminar de medicos' });

          // Agregar a la tabla pacientes
          const paciente = { usuario_id: usuarioId, dni: '', historial_clinico: '', contacto_emergencia: '' }; // Datos iniciales
          db.query('INSERT INTO pacientes SET ?', paciente, (err) => {
            if (err) return res.status(500).json({ error: 'Error al agregar a pacientes' });
            res.json({ message: 'Rol actualizado y datos movidos a pacientes' });
          });
        });
      } else {
        // No se requiere movimiento de datos
        res.json({ message: 'Rol actualizado, sin cambios en tablas adicionales' });
      }
    });
  });
});

router.get('/', (req, res) => {
  db.query(
    'SELECT id, nombre, email, rol FROM usuarios WHERE rol != "administrador"',
    (err, results) => {
      if (err) {
        console.error('Error al obtener usuarios:', err);
        return res.status(500).json({ error: 'Error al obtener usuarios' });
      }
      res.json(results);
    }
  );
});

// Eliminar usuario
router.delete('/:id', (req, res) => {
  const usuarioId = req.params.id;

  // Eliminar usuario y sus datos asociados (paciente o medico)
  db.query('SELECT rol FROM usuarios WHERE id = ?', [usuarioId], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error al obtener el usuario' });
    if (results.length === 0) return res.status(404).json({ error: 'Usuario no encontrado' });

    const rol = results[0].rol;

    // Eliminar de la tabla correspondiente según el rol
    if (rol === 'paciente') {
      db.query('DELETE FROM pacientes WHERE usuario_id = ?', [usuarioId], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar paciente' });
      });
    } else if (rol === 'medico') {
      db.query('DELETE FROM medicos WHERE usuario_id = ?', [usuarioId], (err) => {
        if (err) return res.status(500).json({ error: 'Error al eliminar medico' });
      });
    }

    // Eliminar del usuario
    db.query('DELETE FROM usuarios WHERE id = ?', [usuarioId], (err) => {
      if (err) return res.status(500).json({ error: 'Error al eliminar usuario' });
      res.json({ message: 'Usuario eliminado correctamente' });
    });
  });
});

module.exports = router;
