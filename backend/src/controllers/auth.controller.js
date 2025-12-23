const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Verifica se usuário existe
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 2. Compara senha
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciais inválidas' });
    }

    // 3. Gera JWT
    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: '1d' }
    );

    // 4. Retorna token
    res.json({
      message: 'Login realizado com sucesso',
      token,
    });
  } catch (error) {
    res.status(500).json({
      error: 'Erro no login',
      details: error.message,
    });
  }
};

exports.register = async (req, res) => {
  const { username, email, password, role } = req.body;

  try {
    // Criptografa senha
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
        role: role || 'USER',
      },
    });

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({
      error: 'Erro ao criar usuário',
      details: error.message,
    });
  }
};