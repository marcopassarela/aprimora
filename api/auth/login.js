const authRoutes = require('../../backend/routes/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    console.log('Método não permitido:', req.method); // Debug
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    console.log('Processando login:', req.body); // Debug
    const result = await authRoutes.login(req);
    return res.status(result.status).json(result.body);
  } catch (err) {
    console.error('Erro em /api/auth/login:', err.message); // Debug
    return res.status(400).json({ message: err.message });
  }
};