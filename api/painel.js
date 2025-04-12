const fs = require('fs').promises;
const path = require('path');
const authMiddleware = require('../backend/middleware/auth');

module.exports = async (req, res) => {
  try {
    // Verificar token
    authMiddleware(req);

    // Servir painel.html
    const filePath = path.join(__dirname, '../../painel.html');
    const content = await fs.readFile(filePath, 'utf8');
    res.setHeader('Content-Type', 'text/html');
    return res.status(200).send(content);
  } catch (err) {
    return res.status(401).json({ message: err.message });
  }
};