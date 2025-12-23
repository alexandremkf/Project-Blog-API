const express = require('express');
const cors = require('cors');

// Rotas
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
const usersRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');

// Middlewares globais
const authMiddleware = require('./middleware/auth.middleware');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Middleware de autenticação global
app.use(authMiddleware.authenticate);

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running 🚀' });
});

// Rotas
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);
app.use('/users', usersRoutes); 
app.use('/auth', authRoutes);

module.exports = app;