const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fs = require('fs').promises;
const path = require('path');
const router = express.Router();

// Usar /tmp/users.json no Vercel, backend/data/users.json localmente
const usersFile = process.env.VERCEL
  ? '/tmp/users.json'
  : path.join(__dirname, '../backend/data/users.json');

const JWT_SECRET = process.env.JWT_SECRET || 'sua-chave-secreta-muito-longa-e-unica';

// Função para ler users.json
const readUsers = async () => {
  try {
    const data = await fs.readFile(usersFile, 'utf-8');
    const users = JSON.parse(data);
    console.log(`Leitura bem-sucedida de ${usersFile}, usuários:`, users);
    return users;
  } catch (error) {
    if (error.code === 'ENOENT') {
      console.log(`Arquivo ${usersFile} não encontrado, criando novo`);
      await fs.writeFile(usersFile, '[]');
      return [];
    }
    console.error(`Erro ao ler ${usersFile}:`, error);
    throw new Error('Falha ao ler o arquivo de usuários');
  }
};

// Função para escrever em users.json
const writeUsers = async (users) => {
  try {
    await fs.writeFile(usersFile, JSON.stringify(users, null, 2));
    console.log(`Escrita bem-sucedida em ${usersFile}, usuários:`, users);
  } catch (error) {
    console.error(`Erro ao escrever em ${usersFile}:`, error);
    throw new Error('Falha ao escrever no arquivo de usuários');
  }
};

// Rota de cadastro
router.post('/cadastrar', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Cadastro recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      console.log('Campos faltando:', { username, password });
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const users = await readUsers();
    if (users.find((user) => user.username === username)) {
      console.log('Usuário já existe:', username);
      return res.status(400).json({ error: 'Usuário já existe' });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    users.push({ username, password: hashedPassword });
    await writeUsers(users);

    res.status(201).json({ message: 'Cadastro realizado com sucesso!' });
  } catch (error) {
    console.error('Erro no cadastro:', error.message);
    res.status(500).json({ error: error.message || 'Erro ao cadastrar' });
  }
});

// Rota de login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    console.log('Login recebido:', { username, password: '[HIDDEN]' });

    if (!username || !password) {
      console.log('Campos faltando:', { username, password });
      return res.status(400).json({ error: 'Preencha todos os campos' });
    }

    const users = await readUsers();
    console.log('Usuários carregados para login:', users);

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
    console.log('Token gerado para:', username);
    res.json({ token, redirect: '/painel.html' });
  } catch (error) {
    console.error('Erro no login:', error.message);
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
    console.error('Erro ao processar /api/auth/painel:', error.message);
    res.status(500).json({ error: 'Erro ao acessar o painel' });
  }
});

module.exports = router;