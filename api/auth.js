const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Pool } = require('pg');
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || '12345';

// Conexão com Aiven PostgreSQL
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.VERCEL
    ? { rejectUnauthorized: true }
    : { rejectUnauthorized: false }, // Ignora erro de certificado localmente 
});

// Testar conexão na inicialização
pool.connect((err) => {
  if (err) {
    console.error('[PG] Erro ao conectar ao PostgreSQL:', err.message);
  } else {
    console.log('[PG] Conectado ao PostgreSQL');
  }
});

// Rota de cadastro
router.post('/cadastrar', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('[CADASTRO] Recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      console.log('[CADASTRO] Campos faltando:', { username, password });
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    // Verificar se usuário existe
    const userCheck = await pool.query('SELECT username FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    if (userCheck.rows.length > 0) {
      console.log('[CADASTRO] Usuário já existe:', username);
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    // Hash da senha
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Inserir usuário
    await pool.query('INSERT INTO users (username, password) VALUES ($1, $2)', [username, hashedPassword]);
    console.log('[CADASTRO] Usuário inserido:', username);

    res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    console.error('[CADASTRO] Erro:', error.message);
    res.status(500).json({ error: 'Erro ao cadastrar' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('[LOGIN] Recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      console.log('[LOGIN] Campos faltando:', { username, password });
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    // Buscar usuário
    const result = await pool.query('SELECT * FROM users WHERE LOWER(username) = LOWER($1)', [username]);
    const user = result.rows[0];

    if (!user) {
      console.log('[LOGIN] Usuário não encontrado:', username);
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    // Verificar senha
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('[LOGIN] Senha inválida para:', username);
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    // Gerar token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('[LOGIN] Token gerado para:', username);
    res.json({ token, redirect: '/painel.html' });
  } catch (error) {
    console.error('[LOGIN] Erro:', error.message);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Rota protegida para o painel
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