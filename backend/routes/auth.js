const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Caminho para users.json
const filePath = path.join(__dirname, '../data/users.json');

// Função auxiliar para ler users.json
async function readUsers() {
    try {
        const data = await fs.readFile(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        if (error.code === 'ENOENT') {
            await fs.writeFile(filePath, '[]', 'utf8');
            return [];
        }
        throw error;
    }
}

// Função auxiliar para escrever em users.json
async function writeUsers(users) {
    try {
        await fs.writeFile(filePath, JSON.stringify(users, null, 2), 'utf8');
    } catch (error) {
        console.error('Erro ao escrever users.json:', error);
        throw new Error('Falha ao salvar dados do usuário');
    }
}

// Registro
router.post('/register', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validar entrada
        if (!email || !senha) {
            console.error('Dados incompletos:', { email, senha });
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Ler usuários
        let users = await readUsers();

        // Verificar se o usuário existe
        if (users.find(user => user.email === email)) {
            console.error('Usuário já existe:', email);
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        // Verificar limite de 30 usuários
        if (users.length >= 30) {
            console.error('Limite de usuários atingido:', users.length);
            return res.status(400).json({ error: 'Limite de usuários atingido' });
        }

        // Hash da senha
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        console.log('Senha hasheada para:', email);

        // Adicionar novo usuário
        const newUser = { id: users.length + 1, email, senha: hashedPassword };
        users.push(newUser);
        await writeUsers(users);
        console.log('Novo usuário adicionado:', newUser);

        // Verificar JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET não definido');
            return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token gerado para:', email);

        res.status(201).json({ token });
    } catch (error) {
        console.error('Erro no registro:', error);
        res.status(500).json({ error: error.message || 'Erro no servidor' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        // Validar entrada
        if (!email || !senha) {
            console.error('Dados incompletos:', { email, senha });
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        // Ler usuários
        const users = await readUsers();

        // Verificar usuário
        const user = users.find(user => user.email === email);
        if (!user) {
            console.error('Usuário não encontrado:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verificar senha
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            console.error('Senha incorreta para:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        // Verificar JWT_SECRET
        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET não definido');
            return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }

        // Gerar token JWT
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token gerado para login:', email);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro no login:', error);
        res.status(500).json({ error: error.message || 'Erro no servidor' });
    }
});

module.exports = require('./backend/routes/auth');