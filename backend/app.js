const express = require('express');
const { Pool } = require('pg');
const bcrypt = require('bcrypt');
const { generateToken, verifyToken } = require('./jwt');

const app = express();
app.use(express.json());

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.header('Access-Control-Allow-Methods', 'GET, POST');
        return res.status(200).json({});
    }
    next();
});

const pool = new Pool({
    user: 'postgres',
    host: 'localhost', // Será substituído por variáveis de ambiente na Vercel
    database: 'DB',
    password: '5213',
    port: 5432,
});

app.post('/register', async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            return res.status(400).json({ error: 'Usuário e senha são obrigatórios' });
        }

        const password_hash = await bcrypt.hash(password, 10);
        const result = await pool.query(
            'INSERT INTO users (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [username, password_hash]
        );

        const user = result.rows[0];
        const token = generateToken(user);
        res.json({ token, message: 'Registro concluído com sucesso' });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(409).json({ error: 'Usuário já existe' });
        }
        res.status(500).json({ error: error.message });
    }
});

app.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const result = await pool.query('SELECT * FROM users WHERE username = $1', [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuário não encontrado' });
        }

        const user = result.rows[0];
        if (!await bcrypt.compare(password, user.password_hash)) {
            return res.status(401).json({ error: 'Senha inválida' });
        }

        const token = generateToken(user);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = app; // Exporte o app para Vercel