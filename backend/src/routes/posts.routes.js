const express = require('express');
const router = express.Router();

const postsController = require('../controllers/posts.controller');

// Públicas
router.get('/', postsController.getPublishedPosts);
router.get('/:id', postsController.getPostById);

// Temporariamente aberta (depois vai ser protegida)
router.post('/', postsController.createPost);

module.exports = router;