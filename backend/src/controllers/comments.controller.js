const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /comments/post/:postId
 * Lista todos os comentários de um post
 */
exports.getCommentsByPost = async (req, res) => {
  const postId = Number(req.params.postId);

  try {
    const comments = await prisma.comment.findMany({
      where: { postId },
      orderBy: { createdAt: 'asc' },
    });

    res.json(comments);
  } catch (err) {
    console.error('Erro ao buscar comentários:', err);
    res.status(500).json({ error: 'Erro ao buscar comentários' });
  }
};

/**
 * POST /comments/:postId
 * Cria um comentário para um post
 */
exports.createComment = async (req, res) => {
  const postId = Number(req.params.postId);
  const { content, username } = req.body;

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
    console.error('Erro ao criar comentário:', err);
    res.status(400).json({ error: 'Erro ao criar comentário', details: err.message });
  }
};

/**
 * PUT /comments/:id/publish
 * Publica um comentário
 */
exports.publishComment = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { published: true },
    });

    res.json({ message: 'Comentário publicado com sucesso', comment });
  } catch (err) {
    console.error('Erro ao publicar comentário:', err);
    res.status(400).json({ error: 'Erro ao publicar comentário', details: err.message });
  }
};

/**
 * PUT /comments/:id/unpublish
 * Despublica um comentário
 */
exports.unpublishComment = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const comment = await prisma.comment.update({
      where: { id },
      data: { published: false },
    });

    res.json({ message: 'Comentário despublicado com sucesso', comment });
  } catch (err) {
    console.error('Erro ao despublicar comentário:', err);
    res.status(400).json({ error: 'Erro ao despublicar comentário', details: err.message });
  }
};

/**
 * DELETE /comments/:id
 * Deleta um comentário
 */
exports.deleteComment = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.comment.delete({ where: { id } });
    res.json({ message: 'Comentário deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar comentário:', err);
    res.status(400).json({ error: 'Erro ao deletar comentário', details: err.message });
  }
};