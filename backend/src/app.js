const express = require('express');
const cors = require('cors');

// Rotas
const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');
const usersRoutes = require('./routes/users.routes');
const authRoutes = require('./routes/auth.routes');

// Middlewares globais
const { authenticate } = require('./middleware/auth.middleware');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota pública de teste
app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running 🚀' });
});

// Rotas públicas e protegidas
app.use('/auth', authRoutes); // registro/login público
app.use('/users', usersRoutes); // criação de usuários protegida
app.use('/posts', postsRoutes); // CRUD de posts protegido conforme roles
app.use('/comments', commentsRoutes); // CRUD de comentários protegido conforme roles

module.exports = app;