const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Armazenamento em memória (temporário para testes)
let users = [];

module.exports = {
  register: async (req) => {
    const { email, password } = req.body;

    console.log('Tentativa de registro:', email);

    // Validar entrada
    if (!email || !password) {
      console.error('Dados incompletos:', { email, password });
      throw new Error('Email e senha são obrigatórios');
    }

    // Verificar se o usuário existe
    const existingUser = users.find((user) => user.email === email);
    if (existingUser) {
      console.error('Usuário já existe:', email, 'Detalhes:', existingUser);
      throw new Error('Usuário já existe');
    }
    console.log('Nenhum usuário existente encontrado para:', email);

    // Verificar limite de 30 usuários
    if (users.length >= 30) {
      console.error('Limite de usuários atingido:', users.length);
      throw new Error('Limite de usuários atingido');
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Senha hasheada para:', email);

    // Adicionar novo usuário
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);
    console.log('Novo usuário adicionado:', newUser);

    // Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não definido');
      throw new Error('Erro de configuração do servidor');
    }

    // Gerar token JWT
    const token = jwt.sign({ id: newUser.id, email: newUser.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Token gerado para:', email);

    return { status: 201, body: { token } };
  },

  login: async (req) => {
    const { email, password } = req.body;

    console.log('Tentativa de login:', email);

    // Validar entrada
    if (!email || !password) {
      console.error('Dados incompletos:', { email, password });
      throw new Error('Email e senha são obrigatórios');
    }

    // Verificar usuário
    const user = users.find((user) => user.email === email);
    if (!user) {
      console.error('Usuário não encontrado:', email);
      throw new Error('Credenciais inválidas');
    }

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Senha incorreta para:', email);
      throw new Error('Credenciais inválidas');
    }

    // Verificar JWT_SECRET
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET não definido');
      throw new Error('Erro de configuração do servidor');
    }

    // Gerar token JWT
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });
    console.log('Token gerado para login:', email);

    return { status: 200, body: { token } };
  },
};