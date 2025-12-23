const prisma = require('../prisma');

// GET /comments/post/:postId
exports.getCommentsByPost = async (req, res) => {
  const postId = Number(req.params.postId);

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
};

// POST /comments
exports.createComment = async (req, res) => {
  const { content, username, postId } = req.body;

  try {
    const comment = await prisma.comment.create({
      data: {
        content,
        username,
        postId,
      },
    });

    res.status(201).json(comment);
  } catch (err) {
    res.status(400).json({ error: 'Erro ao criar comentário' });
  }
};