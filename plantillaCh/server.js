const express = require('express');
const pool = require('./db');
const app = express();

app.use(express.json());

// Crear cliente
app.post('/clients', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    try {
        const [result] = await pool.execute(
            'INSERT INTO Client (name, email) VALUES (?, ?)',
            [name, email]
        );
        res.status(201).json({ id: result.insertId, name, email });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Listar clientes
app.get('/clients', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Client');
    res.json(rows);
});

// Obtener cliente por ID
app.get('/clients/:id', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM Client WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Client not found' });
    res.json(rows[0]);
});

// Actualizar cliente
app.put('/clients/:id', async (req, res) => {
    const { name, email } = req.body;
    if (!name || !email) return res.status(400).json({ error: 'Name and email required' });
    const [result] = await pool.execute(
        'UPDATE Client SET name = ?, email = ? WHERE id = ?',
        [name, email, req.params.id]
    );
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Client not found' });
    res.json({ id: req.params.id, name, email });
});

// Eliminar cliente
app.delete('/clients/:id', async (req, res) => {
    const [result] = await pool.execute('DELETE FROM Client WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Client not found' });
    res.json({ message: 'Client deleted' });
});

app.listen(3000, () => console.log('Servidor Express corriendo en puerto 3000'));