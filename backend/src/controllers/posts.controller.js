const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

/**
 * GET /posts
 * Lista todos os posts publicados
 */
exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: { author: { select: { username: true } } },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (err) {
    console.error('Erro ao buscar posts:', err);
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};

/**
 * GET /posts/:id
 * Busca um post específico pelo id
 */
exports.getPostById = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const post = await prisma.post.findUnique({
      where: { id },
      include: {
        author: { select: { username: true } },
        comments: true,
      },
    });

    if (!post || !post.published) return res.status(404).json({ error: 'Post não encontrado' });

    res.json(post);
  } catch (err) {
    console.error('Erro ao buscar post:', err);
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
};

/**
 * POST /posts
 * Cria um post (somente ADMIN ou AUTHOR)
 */
exports.createPost = async (req, res) => {
  const { title, content, authorId } = req.body;

  try {
    const post = await prisma.post.create({
      data: { title, content, authorId },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Erro ao criar post:', err);
    res.status(400).json({ error: 'Erro ao criar post', details: err.message });
  }
};

/**
 * PUT /posts/:id/publish
 * Publica um post
 */
exports.publishPost = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: true },
    });

    res.json({ message: 'Post publicado com sucesso', post });
  } catch (err) {
    console.error('Erro ao publicar post:', err);
    res.status(400).json({ error: 'Erro ao publicar post', details: err.message });
  }
};

/**
 * PUT /posts/:id/unpublish
 * Despublica um post
 */
exports.unpublishPost = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: false },
    });

    res.json({ message: 'Post despublicado com sucesso', post });
  } catch (err) {
    console.error('Erro ao despublicar post:', err);
    res.status(400).json({ error: 'Erro ao despublicar post', details: err.message });
  }
};

/**
 * PUT /posts/:id
 * Atualiza título e conteúdo do post
 */
exports.updatePost = async (req, res) => {
  const id = Number(req.params.id);
  const { title, content } = req.body;

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { title, content },
    });

    res.json({ message: 'Post atualizado com sucesso', post });
  } catch (err) {
    console.error('Erro ao atualizar post:', err);
    res.status(400).json({ error: 'Erro ao atualizar post', details: err.message });
  }
};

/**
 * DELETE /posts/:id
 * Deleta um post
 */
exports.deletePost = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.post.delete({ where: { id } });
    res.json({ message: 'Post deletado com sucesso' });
  } catch (err) {
    console.error('Erro ao deletar post:', err);
    res.status(400).json({ error: 'Erro ao deletar post', details: err.message });
  }
};