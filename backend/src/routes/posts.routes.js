const express = require('express');
const router = express.Router();

// Controllers
const postsController = require('../controllers/posts.controller');

// Middlewares
const { authenticate } = require('../middleware/auth.middleware');
const { requireAdmin } = require('../middleware/role.middleware');

// Publicar post
router.put('/:id/publish', authenticate, requireAdmin, postsController.publishPost);

// Despublicar post
router.put('/:id/unpublish', authenticate, requireAdmin, postsController.unpublishPost);

// Atualizar post
router.put('/:id', authenticate, requireAdmin, postsController.updatePost);

// Deletar post
router.delete('/:id', authenticate, requireAdmin, postsController.deletePost);

// Públicas
router.get('/', postsController.getPublishedPosts);
router.get('/:id', postsController.getPostById);

// Protegida - Criar post
router.post('/', authenticate, requireAdmin, postsController.createPost);

module.exports = router;