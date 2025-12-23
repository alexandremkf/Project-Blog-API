const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

// GET /posts
exports.getPublishedPosts = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      include: {
        author: { select: { username: true } },
      },
      orderBy: { createdAt: 'desc' },
    });

    res.json(posts);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar posts' });
  }
};

// GET /posts/:id
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

    if (!post || !post.published) {
      return res.status(404).json({ error: 'Post não encontrado' });
    }

    res.json(post);
  } catch (err) {
    res.status(500).json({ error: 'Erro ao buscar post' });
  }
};

// POST /posts
exports.createPost = async (req, res) => {
  const { title, content, authorId } = req.body;

  try {
    const post = await prisma.post.create({
      data: {
        title,
        content,
        authorId,
      },
    });

    res.status(201).json(post);
  } catch (err) {
    console.error('Erro ao criar post:', err);
    res.status(400).json({ error: 'Erro ao criar post', details: err.message });
  }
};

// PUT /posts/:id/publish
exports.publishPost = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: true },
    });

    res.json({ message: 'Post publicado com sucesso', post });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao publicar post' });
  }
};

// PUT /posts/:id/unpublish
exports.unpublishPost = async (req, res) => {
  const id = Number(req.params.id);

  try {
    const post = await prisma.post.update({
      where: { id },
      data: { published: false },
    });

    res.json({ message: 'Post despublicado com sucesso', post });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao despublicar post' });
  }
};

// PUT /posts/:id
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
    console.error(err);
    res.status(400).json({ error: 'Erro ao atualizar post' });
  }
};

// DELETE /posts/:id
exports.deletePost = async (req, res) => {
  const id = Number(req.params.id);

  try {
    await prisma.post.delete({
      where: { id },
    });

    res.json({ message: 'Post deletado com sucesso' });
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: 'Erro ao deletar post' });
  }
};