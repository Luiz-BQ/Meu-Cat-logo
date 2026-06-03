const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const app = express();
app.use(express.json());
app.use(cors());
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'senha',    
    database: 'meu_catalogo'
});
db.connect(err => {
    if (err) {
        console.error('Erro ao conectar ao MySQL:', err);
        return;
    }
    console.log('Conectado ao banco de dados MySQL.');
});
app.post('/itens', (req, res) => {
    const { nome, categoria, descricao, nota } = req.body;
    const query = 'INSERT INTO itens (nome, categoria, descricao, nota) VALUES (?, ?, ?, ?)';
    db.query(query, [nome, categoria, descricao, nota], (err, result) => {
        if (err) return res.status(500).send(err);
        res.status(201).send({ id: result.insertId, ...req.body });
    });
});
app.get('/itens', (req, res) => {
    const query = 'SELECT * FROM itens';
    db.query(query, (err, results) => {
        if (err) return res.status(500).send(err);
        res.json(results);
    });
});
app.delete('/itens/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM itens WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) return res.status(500).send(err);
        res.send({ message: 'Item excluído com sucesso!' });
    });
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});