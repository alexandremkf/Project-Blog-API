const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts.controller');

// Publicar post
router.put('/:id/publish', postsController.publishPost);

// Despublicar post
router.put('/:id/unpublish', postsController.unpublishPost);

// Públicas
router.get('/', postsController.getPublishedPosts);
router.get('/:id', postsController.getPostById);

// Temporariamente aberta (depois vai ser protegida)
router.post('/', postsController.createPost);

module.exports = router;