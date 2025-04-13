const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./api/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Servir arquivos HTML da raiz

// Rotas de autenticação
app.use('/api/auth', authRoutes);

// Iniciar o servidor localmente apenas se não estiver no Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;