const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || '12345';

// Definindo se estamos em produção ou desenvolvimento
const isProduction = process.env.NODE_ENV === 'production';

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }, // para Aiven, é necessário aceitar certificados autoassinados
  }); 
  

// Testar conexão na inicialização
pool.connect((err, client, release) => {
  if (err) {
    console.error('[PG] Erro ao conectar ao PostgreSQL:', err.message, err.stack);
    return;
  }
  console.log('[PG] Conectado ao PostgreSQL');
  client.query('SELECT 1 FROM users LIMIT 1', (err, result) => {
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
    console.log('[CADASTRO] Recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      console.log('[CADASTRO] Campos faltando:', { username, password });
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    client = await pool.connect();
    console.log('[CADASTRO] Cliente conectado para:', username);

    const userCheck = await client.query('SELECT username FROM users WHERE username = $1', [username]);
    console.log('[CADASTRO] Resultado da verificação:', userCheck.rows);
    if (userCheck.rows.length > 0) {
      console.log('[CADASTRO] Usuário já existe:', username);
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    console.log('[CADASTRO] Senha hasheada:', hashedPassword);

    const insertResult = await client.query('INSERT INTO users (username, password) VALUES ($1, $2) RETURNING username', [username, hashedPassword]);
    console.log('[CADASTRO] Usuário inserido:', insertResult.rows[0]);

    res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    console.error('[CADASTRO] Erro:', error.message, err.stack);
    res.status(500).json({ error: 'Erro ao cadastrar', details: error.message });
  } finally {
    if (client) {
      client.release();
      console.log('[CADASTRO] Cliente liberado');
    }
  }
});

router.post('/login', async (req, res) => {
  let client;
  try {
    const { username, password } = req.body;
    console.log('[LOGIN] Recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      console.log('[LOGIN] Campos faltando:', { username, password });
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    client = await pool.connect();
    console.log('[LOGIN] Cliente conectado para:', username);

    const result = await client.query('SELECT * FROM users WHERE username = $1', [username]);
    console.log('[LOGIN] Resultado da query:', result.rows);
    const user = result.rows[0];

    if (!user) {
      console.log('[LOGIN] Usuário não encontrado:', username);
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    console.log('[LOGIN] Senha armazenada:', user.password);
    const passwordMatch = await bcrypt.compare(password, user.password);
    console.log('[LOGIN] Senha corresponde:', passwordMatch);

    if (!passwordMatch) {
      console.log('[LOGIN] Senha inválida para:', username);
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('[LOGIN] Token gerado para:', username);
    res.json({ token, redirect: '/painel.html' });
  } catch (error) {
    console.error('[LOGIN] Erro:', error.message, err.stack);
    res.status(500).json({ error: 'Erro ao fazer login', details: error.message });
  } finally {
    if (client) {
      client.release();
      console.log('[LOGIN] Cliente liberado');
    }
  }
});

router.get('/painel', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('[PAINEL] Cabeçalho Authorization:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      console.log('[PAINEL] Token não fornecido');
      return res.status(401).json({ error: 'Acesso negado' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log('[PAINEL] Erro na verificação do token:', err.message);
        return res.status(403).json({ error: 'Token inválido' });
      }
      console.log('[PAINEL] Token válido, usuário:', user);
      res.json({ message: 'Bem-vindo ao painel!', user });
    });
  } catch (error) {
    console.error('[PAINEL] Erro:', error.message);
    res.status(500).json({ error: 'Erro ao acessar o painel' });
  }
});

module.exports = router;
