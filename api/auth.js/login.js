const authRoutes = require('../../backend/routes/auth');

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Método não permitido' });
  }

  try {
    const result = await authRoutes.login(req);
    return res.status(result.status).json(result.body);
  } catch (err) {
    return res.status(400).json({ message: err.message });
  }
};