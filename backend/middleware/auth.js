const jwt = require('jsonwebtoken');

module.exports = function (req) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.replace('Bearer ', '');

  if (!token) {
    throw new Error('Acesso negado. Nenhum token fornecido.');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded;
  } catch (err) {
    throw new Error('Token inválido.');
  }
};