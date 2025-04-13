const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

let users = [];

router.post('/register', async (req, res) => {
    try {
        console.log('POST /api/auth/register:', req.body);
        const { email, senha } = req.body;

        if (!email || !senha) {
            console.error('Dados incompletos:', { email, senha });
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        if (users.find(user => user.email === email)) {
            console.error('Usuário já existe:', email);
            return res.status(400).json({ error: 'Usuário já existe' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        const newUser = { id: users.length + 1, email, senha: hashedPassword };
        users.push(newUser);
        console.log('Usuário registrado:', newUser);

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET não definido');
            return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }

        const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token gerado:', token);

        res.status(201).json({ token });
    } catch (error) {
        console.error('Erro no registro:', error.stack);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

router.post('/login', async (req, res) => {
    try {
        console.log('POST /api/auth/login:', req.body);
        const { email, senha } = req.body;

        if (!email || !senha) {
            console.error('Dados incompletos:', { email, senha });
            return res.status(400).json({ error: 'Email e senha são obrigatórios' });
        }

        const user = users.find(user => user.email === email);
        if (!user) {
            console.error('Usuário não encontrado:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        const isMatch = await bcrypt.compare(senha, user.senha);
        if (!isMatch) {
            console.error('Senha incorreta:', email);
            return res.status(401).json({ error: 'Credenciais inválidas' });
        }

        if (!process.env.JWT_SECRET) {
            console.error('JWT_SECRET não definido');
            return res.status(500).json({ error: 'Erro de configuração do servidor' });
        }

        const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        console.log('Token gerado:', token);

        res.status(200).json({ token });
    } catch (error) {
        console.error('Erro no login:', error.stack);
        res.status(500).json({ error: 'Erro no servidor' });
    }
});

module.exports = router;