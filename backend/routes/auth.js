const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Definir caminho absoluto para evitar problemas
const USERS_FILE = path.resolve(__dirname, '../../data/users.json');

module.exports = {
  register: async (req) => {
    const { email, password } = req.body;

    console.log('Tentativa de registro:', email);
    console.log('Caminho do USERS_FILE:', USERS_FILE);

    // Validar entrada
    if (!email || !password) {
      console.error('Dados incompletos:', { email, password });
      throw new Error('Email e senha são obrigatórios');
    }

    // Ler arquivo de usuários
    let users = [];
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      users = JSON.parse(data);
      console.log('Arquivo users.json lido com sucesso');
    } catch (err) {
      if (err.code === 'ENOENT') {
        console.log('users.json não existe, inicializando como vazio');
        users = [];
      } else {
        console.error('Erro ao ler users.json:', err.message);
        throw new Error('Erro ao acessar dados de usuários');
      }
    }

    // Verificar se o usuário existe
    if (users.find((user) => user.email === email)) {
      console.error('Usuário já existe:', email);
      throw new Error('Usuário já existe');
    }

    // Verificar limite de 30 usuários
    if (users.length >= 30) {
      console.error('Limite de usuários atingido');
      throw new Error('Limite de usuários atingido');
    }

    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    console.log('Senha hasheada para:', email);

    // Adicionar novo usuário
    const newUser = { id: users.length + 1, email, password: hashedPassword };
    users.push(newUser);

    // Criar diretório se não existir
    const dir = path.dirname(USERS_FILE);
    try {
      await fs.mkdir(dir, { recursive: true });
      console.log('Diretório criado ou já existe:', dir);
    } catch (err) {
      console.error('Erro ao criar diretório:', err.message);
      throw new Error(`Erro ao preparar salvamento: ${err.message}`);
    }

    // Verificar permissões de escrita
    try {
      await fs.access(dir, fs.constants.W_OK);
      console.log('Permissão de escrita confirmada para:', dir);
    } catch (err) {
      console.error('Sem permissão de escrita em:', dir, err.message);
      throw new Error(`Sem permissão de escrita: ${err.message}`);
    }

    // Salvar no arquivo
    try {
      await fs.writeFile(USERS_FILE, JSON.stringify(users, null, 2));
      console.log('Usuário salvo com sucesso:', email);
    } catch (err) {
      console.error('Erro detalhado ao salvar users.json:', err);
      throw new Error(`Erro ao salvar usuário: ${err.message}`);
    }

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
    console.log('Caminho do USERS_FILE:', USERS_FILE);

    // Validar entrada
    if (!email || !password) {
      console.error('Dados incompletos:', { email, password });
      throw new Error('Email e senha são obrigatórios');
    }

    // Ler arquivo de usuários
    let users = [];
    try {
      const data = await fs.readFile(USERS_FILE, 'utf8');
      users = JSON.parse(data);
      console.log('Arquivo users.json lido com sucesso');
    } catch (err) {
      console.error('Erro ao ler users.json:', err.message);
      throw new Error('Credenciais inválidas');
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