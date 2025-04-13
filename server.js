const express = require('express');
const path = require('path');
const authRoutes = require('./api/auth');

const app = express();

// Middleware para parsing de JSON
app.use(express.json());

// Montar rotas de autenticação
app.use('/api/auth', authRoutes);

// Servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Fallback para index.html (SPA)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));