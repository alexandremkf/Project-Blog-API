const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/comments.controller');

// Publicar comentário
router.put('/:id/publish', commentsController.publishComment);

// Despublicar comentário
router.put('/:id/unpublish', commentsController.unpublishComment);

// Públicas
router.get('/post/:postId', commentsController.getCommentsByPost);

// Temporariamente aberta (depois vai ser protegida)
router.post('/', commentsController.createComment);

module.exports = router;