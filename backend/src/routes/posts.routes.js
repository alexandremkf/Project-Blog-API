const express = require('express');
const router = express.Router();

// Controllers
const postsController = require('../controllers/posts.controller');

// Middlewares
const { authenticate } = require('../middleware/auth.middleware');
const { authorizeRoles } = require('../middleware/role.middleware');

/**
 * ROTAS DE POSTS
 */

// Rotas públicas
router.get('/', postsController.getPublishedPosts); // Listar todos posts publicados
router.get('/:id', postsController.getPostById);    // Buscar post específico pelo id

// Rotas protegidas (somente ADMIN ou AUTHOR)
router.post('/', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.createPost); // Criar post
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.updatePost); // Atualizar post
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.deletePost); // Deletar post

// Publicar / despublicar posts
router.put('/:id/publish', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.publishPost); 
router.put('/:id/unpublish', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.unpublishPost);

module.exports = router;