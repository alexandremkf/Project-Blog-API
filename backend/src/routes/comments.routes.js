const express = require('express');
const router = express.Router();

// Controllers
const commentsController = require('../controllers/comments.controller');

// Middlewares
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

/**
 * ROTAS DE COMENTÁRIOS
 */

// Rotas públicas
router.get('/post/:postId', commentsController.getCommentsByPost); // Listar comentários de um post

// Rotas públicas (usuário logado)
router.post('/:postId', commentsController.createComment); // Criar comentário

// Publicar / despublicar comentários
router.put('/:id/publish', authenticate, authorizeRoles('ADMIN', 'USER'), commentsController.publishComment);
router.put('/:id/unpublish', authenticate, authorizeRoles('ADMIN', 'USER'), commentsController.unpublishComment);

// Deletar comentário
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), commentsController.deleteComment);

module.exports = router;