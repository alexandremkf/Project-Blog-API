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
router.get('/', postsController.getPublishedPosts);

// ⚠️ ROTA ADMIN TEM QUE VIR ANTES DO :id
router.get(
  '/admin',
  authenticate,
  authorizeRoles('ADMIN', 'AUTHOR'),
  postsController.getAllPosts
);

// Rotas públicas
router.get('/:id', postsController.getPostById);

// Rotas protegidas
router.post('/', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.createPost);
router.put('/:id', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.updatePost);
router.delete('/:id', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.deletePost);

// Publicar / despublicar
router.put('/:id/publish', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.publishPost);
router.put('/:id/unpublish', authenticate, authorizeRoles('ADMIN', 'AUTHOR'), postsController.unpublishPost);

module.exports = router;