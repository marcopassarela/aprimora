require('dotenv').config(); // Carrega variáveis do .env
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || '12345';
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

// Testar conexão
pool.connect((err, client, release) => {
  if (err) {
    console.error('[PG] Erro ao conectar ao PostgreSQL:', err.message, err.stack);
    return;
  }
  console.log('[PG] Conectado ao PostgreSQL');
  client.query('SELECT 1 FROM users LIMIT 1', (err) => {
    release();
    if (err) {
      console.error('[PG] Erro ao verificar tabela users:', err.message);
    } else {
      console.log('[PG] Tabela users acessível');
    }
  });
});

router.post('/cadastrar', async (req, res) => {
  let client;
  try {
    const { username, password } = req.body;
    console.log('[CADASTRO] Dados recebidos:', { username });

    if (!username || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    client = await pool.connect();
    const userCheck = await client.query('SELECT username FROM users WHERE username = $1', [username]);

    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const insertResult = await client.query(
      'INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username',
      [username, hashedPassword]
    );

    console.log('[CADASTRO] Usuário inserido:', insertResult.rows[0]);
    res.status(201).json({ message: 'Cadastro realizado com sucesso!' });

  } catch (error) {
    console.error('[CADASTRO] Erro:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao cadastrar', details: error.message });
  } finally {
    if (client) client.release();
  }
});

router.post('/login', async (req, res) => {
  let client;
  try {
    const { username, password } = req.body;
    if (!username || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    client = await pool.connect();
    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    const user = result.rows[0];

    if (!user) {
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    res.json({ token, redirect: '/painel.html' });

  } catch (error) {
    console.error('[LOGIN] Erro:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
  } finally {
    if (client) client.release();
  }
});

router.get('/painel', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Acesso negado' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) return res.status(403).json({ error: 'Token inválido' });
      res.json({ message: 'Bem-vindo ao painel!', user });
    });
  } catch (error) {
    console.error('[PAINEL] Erro:', error.message, error.stack);
    res.status(500).json({ error: 'Erro ao acessar o painel' });
  }
});

module.exports = router;
