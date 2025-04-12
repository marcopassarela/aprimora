const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const USERS_FILE = path.join(__dirname, '../../data/users.json');

module.exports = {
  register: async (req) => {
    const { email, password } = req.body;

    console.log('Tentativa de registro:', email); // Debug

    // Ler arquivo de usuários
    let users = [];
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      users = JSON.parse(data);
    } catch (err) {
      console.error('Erro ao ler users.json:', err); // Debug
      users = []; // Inicializar como vazio se o arquivo não existir
    }

    // Verificar se o usuário existe
    if (users.find((user) => user.email === email)) {
      throw new Error('Usuário já existe');
    }

    // Verificar limite de 30 usuários
    if (users.length >= 30) {
      throw new Error('Limite de usuários atingido');
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Adicionar novo usuário
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);

    // Salvar no arquivo
    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      console.log('Usuário salvo:', email); // Debug
    } catch (err) {
      console.error('Erro ao salvar users.json:', err); // Debug
      throw new Error('Erro ao salvar usuário');
    }

    // Gerar token JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não definido'); // Debug
      throw new Error('Erro de configuração do servidor');
    }
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { status: 201, body: { token } };
  },

  login: async (req) => {
    const { email, password } = req.body;

    console.log('Tentativa de login:', email); // Debug

    // Ler arquivo de usuários
    let users = [];
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      users = JSON.parse(data);
    } catch (err) {
      console.error('Erro ao ler users.json:', err); // Debug
      throw new Error('Credenciais inválidas');
    }

    // Verificar usuário
    const user = users.find((user) => user.email === email);
    if (!user) {
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciais inválidas');
    }

    // Gerar token JWT
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não definido'); // Debug
      throw new Error('Erro de configuração do servidor');
    }
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { status: 200, body: { token } };
  },
};