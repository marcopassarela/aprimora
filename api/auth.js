const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Armazenamento em memória
let users = [];

router.post('/register', async (req, res) => {
    try {
        console.log('Iniciando registro:', req.body);
        const { email, senha } = req.body;

        if (!email || !senha) {
            console.error('Dados incompletos:', { email, senha });
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        if (users.find(user => user.email === email)) {
            console.error('Usuário já existe:', email);
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        if (users.length >= 30) {
            console.error('Limite de usuários atingido:', users.length);
            return res.status(400).json({ error: 'Limite de usuários atingido' });
        }

        const salt = await bcrypt.genSalt(10);
        console.log('Salt gerado para:', email);
        const hashedPassword = await bcrypt.hash(senha, salt);
        console.log('Senha hasheada para:', email);

        const newUser = { id: users.length + 1, email, senha: hashedPassword };
        users.push(newUser);
        console.log('Novo usuário adicionado:', newUser);

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET não definido');
            return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token gerado para:', email);

        res.status(201).json({ token });
    } catch (error) {
        console.error('Erro no registro:', error.stack);
        res.status(500).json({ error: 'Erro no servidor: ' + error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log('Iniciando login:', req.body);
        const { email, senha } = req.body;

        if (!email || !senha) {
            console.error('Dados incompletos:', { email, senha });
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        console.log('Procurando usuário:', email);
        const user = users.find(user => user.email === email);
        if (!user) {
            console.error('Usuário não encontrado:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        console.log('Verificando senha para:', email);
        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            console.error('Senha incorreta para:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET não definido');
            return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }

        console.log('Gerando token para:', email);
        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token gerado para login:', email);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro no login:', error.stack);
        res.status(500).json({ error: 'Erro no servidor: ' + error.message });
    }
});

module.exports = router;