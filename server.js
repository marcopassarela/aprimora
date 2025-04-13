const express = require('express');
const path = require('path');
const cors = require('cors');
const authRoutes = require('./api/auth');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(__dirname));

app.use('/api/auth', authRoutes);

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
  });
}

module.exports = app;