const express = require('express');
const cors = require('cors');

const postsRoutes = require('./routes/posts.routes');
const commentsRoutes = require('./routes/comments.routes');

const app = express();

// Middlewares globais
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
  res.json({ message: 'Blog API is running 🚀' });
});

// Rotas
app.use('/posts', postsRoutes);
app.use('/comments', commentsRoutes);

module.exports = app;