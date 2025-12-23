const express = require('express');
const router = express.Router();

const commentsController = require('../controllers/comments.controller');

router.get('/post/:postId', commentsController.getCommentsByPost);
router.post('/', commentsController.createComment);

module.exports = router;