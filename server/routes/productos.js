const express = require('express');
const cors = require('cors');
const router = express.Router();
const db = require('../db');

const app = express();

// Habilitar CORS para todas las solicitudes
app.use(cors()); // Esto permite las solicitudes desde cualquier origen

// Middleware para parsear el cuerpo de las solicitudes en formato JSON
app.use(express.json());

// Definir las rutas de los productos
router.get('/', (req, res) => {
    db.query('SELECT * FROM productos', (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

router.get('/:id', (req, res) => {
    const { id } = req.params;
    db.query('SELECT * FROM productos WHERE id = ?', [id], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
        res.json(results[0]);
    });
});

router.post('/', (req, res) => {
    const { nombre, dosis, efectos_secundarios } = req.body;
    db.query(
        'INSERT INTO productos (nombre, dosis, efectos_secundarios) VALUES (?, ?, ?)',
        [nombre, dosis, efectos_secundarios],
        (err, results) => {
            if (err) return res.status(500).json({ error: err.message });
            res.status(201).json({ message: 'Producto creado con éxito' });
        }
    );
});

router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { nombre, dosis, efectos_secundarios } = req.body;
    db.query(
        'UPDATE productos SET nombre = ?, dosis = ?, efectos_secundarios = ? WHERE id = ?',
        [nombre, dosis, efectos_secundarios, id],
        (err) => {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Producto actualizado con éxito' });
        }
    );
});

router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM productos WHERE id = ?', [id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Producto eliminado con éxito' });
    });
});

// Exportar el router
module.exports = router;

// Iniciar el servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
