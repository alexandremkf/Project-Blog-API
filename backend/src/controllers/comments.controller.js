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

// PUT /comments/:id/publish
exports.publishComment = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { published: true },
    });

    res.json({
      message: 'Comentário publicado com sucesso',
      comment,
    });
  } catch (err) {
    console.error('Erro ao publicar comentário:', err);

    res.status(400).json({
      error: 'Erro ao publicar comentário',
      details: err.message,
    });
  }
};

// PUT /comments/:id/unpublish
exports.unpublishComment = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { published: false },
    });

    res.json({
      message: 'Comentário despublicado com sucesso',
      comment,
    });
  } catch (err) {
    console.error('Erro ao despublicar comentário:', err);

    res.status(400).json({
      error: 'Erro ao despublicar comentário',
      details: err.message,
    });
  }
};

// PUT /comments/:id
exports.deleteComment = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.comment.delete({
      where: { id },
    });

    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar comentário:', err);

    res.status(400).json({
      error: 'Erro ao deletar comentário',
      details: err.message,
    });
  }
};