const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Usar /tmp no Vercel, fallback para backend/data/users.json localmente
const isVercel = process.env.VERCEL;
const usersFile = isVercel
  ? '/tmp/users.json'
  : path.join(__dirname, '../backend/data/users.json');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-temporaria';

// Função para ler users.json
const readUsers = async () => {
  try {
    const data = await fs.readFile(usersFile, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    if (error.code === 'ENOENT') {
      await fs.writeFile(usersFile, '[]');
      return [];
    }
    console.error('Erro ao ler users.json:', error);
    throw error;
  }
};

// Função para escrever em users.json
const writeUsers = async (users) => {
  try {
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
  } catch (error) {
    console.error('Erro ao escrever em users.json:', error);
    throw error;
  }
};

// Rota de cadastro
router.post('/cadastrar', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Cadastro recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const users = await readUsers();
    if (users.find((user) => user.username === username)) {
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    users.push({ username, password: hashedPassword });
    await writeUsers(users);

    res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no cadastro:', error);
    res.status(500).json({ error: 'Erro ao cadastrar' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const users = await readUsers();
    const user = users.find((user) => user.username === username);

    if (!user) {
      console.log('Usuário não encontrado:', username);
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      console.log('Senha inválida para:', username);
      return res.status(400).json({ error: 'Usuário ou senha inválidos' });
    }

    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    console.log('Token gerado:', token);
    res.json({ token, redirect: '/painel.html' });
  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ error: 'Erro ao fazer login' });
  }
});

// Rota protegida para o painel
router.get('/painel', (req, res) => {
  try {
    const authHeader = req.headers['authorization'];
    console.log('Cabeçalho Authorization recebido:', authHeader);

    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
      console.log('Token não fornecido');
      return res.status(401).json({ error: 'Acesso negado' });
    }

    console.log('Verificando token:', token);
    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        console.log('Erro na verificação do token:', err.message);
        return res.status(403).json({ error: 'Token inválido' });
      }
      console.log('Token válido, usuário:', user);
      res.json({ message: 'Bem-vindo ao painel!', user });
    });
  } catch (error) {
    console.error('Erro ao processar /api/auth/painel:', error);
    res.status(500).json({ error: 'Erro ao acessar o painel' });
  }
});

module.exports = router;