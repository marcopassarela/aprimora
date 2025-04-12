const fs = require('fs').promises;
const path = require('path');
const authMiddleware = require('../backend/middleware/auth');

module.exports = async (req, res) => {
  try {
    console.log('Verificando acesso ao painel'); // Debug
    authMiddleware(req);

    const filePath = path.join(__dirname, '../../painel.html');
    const content = await fs.readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(content);
  } catch (err) {
    console.error('Erro em /api/painel:', err.message); // Debug
    return res.status(401).json({ message: err.message });
  }
};