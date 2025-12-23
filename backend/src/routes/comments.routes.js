const express = require('express');
const router = express.Router();

// Controllers
const commentsController = require('../controllers/comments.controller');

// Middlewares
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

// Publicar comentário
router.put('/:id/publish', authenticate, requireAdmin, commentsController.publishComment);

// Despublicar comentário
router.put('/:id/unpublish', authenticate, requireAdmin, commentsController.unpublishComment);

// Deletar comentário
router.delete('/:id', authenticate, requireAdmin, commentsController.deleteComment);

// Públicas
router.get('/post/:postId', commentsController.getCommentsByPost);

// Temporariamente aberta (depois vai ser protegida)
router.post('/', commentsController.createComment);

module.exports = router;