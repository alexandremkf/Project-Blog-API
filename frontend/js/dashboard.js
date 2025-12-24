/*************************************************
 * 1️⃣ AUTENTICAÇÃO + AUTORIZAÇÃO
 *************************************************/

const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '../login.html';
}

const user = JSON.parse(atob(token.split('.')[1]));

if (user.role !== 'ADMIN' && user.role !== 'AUTHOR') {
  alert('Acesso negado');
  window.location.href = '../index.html';
}

/*************************************************
 * 2️⃣ VARIÁVEIS GLOBAIS
 *************************************************/

const postsTable = document.getElementById('posts-table');
const commentsTable = document.getElementById('comments-table');

const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');
const formTitle = document.getElementById('form-title');
const submitBtn = document.getElementById('submit-btn');

let editingPostId = null; // CONTROLA EDIÇÃO

/*************************************************
 * 3️⃣ POSTS — LISTAR
 *************************************************/

async function fetchAllPosts() {
  try {
    const res = await fetch('https://blog-api-m84c.onrender.com/posts', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();

    const posts = await res.json();

    postsTable.innerHTML = posts
      .map(
        (post) => `
        <tr>
          <td>${post.title}</td>
          <td>${post.author.username}</td>
          <td>${post.published ? 'Publicado' : 'Rascunho'}</td>
          <td>
            <button onclick="editPost(${post.id}, '${post.title.replace(/'/g, "\\'")}', '${post.content.replace(/'/g, "\\'")}')">
              ${editingPostId === post.id ? 'Cancelar' : 'Editar'}
            </button>
            <button onclick="togglePublish(${post.id}, ${post.published})">
              ${post.published ? 'Despublicar' : 'Publicar'}
            </button>
            <button onclick="deletePost(${post.id})">Excluir</button>
          </td>
        </tr>
      `
      )
      .join('');
  } catch {
    postsTable.innerHTML =
      '<tr><td colspan="4">Erro ao carregar posts</td></tr>';
  }
}

/*************************************************
 * 4️⃣ POSTS — CRIAR / EDITAR
 *************************************************/

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const payload = {
    title: titleInput.value,
    content: contentInput.value,
    authorId: user.id,
  };

  try {
    let url = 'https://blog-api-m84c.onrender.com/posts';
    let method = 'POST';

    // MODO EDIÇÃO
    if (editingPostId) {
      url = `https://blog-api-m84c.onrender.com/posts/${editingPostId}`;
      method = 'PUT';
    }

    const res = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    if (!res.ok) throw new Error('Erro ao salvar post');

    resetForm();
    fetchAllPosts();
  } catch (err) {
    console.error(err);
    alert('Erro ao salvar post');
  }
});

/*************************************************
 * 5️⃣ POSTS — EDITAR
 *************************************************/

function editPost(postId, title, content) {
  // Se já está editando esse post → cancelar
  if (editingPostId === postId) {
    resetForm();
    return;
  }

  editingPostId = postId;

  titleInput.value = title;
  contentInput.value = content;

  formTitle.textContent = 'Editando Post';
  submitBtn.textContent = 'Salvar Alterações';

  fetchAllPosts();
}

/*************************************************
 * 5️⃣ POSTS — RESET FORM
 *************************************************/
function resetForm() {
  editingPostId = null;

  postForm.reset();

  formTitle.textContent = 'Novo Post';
  submitBtn.textContent = 'Criar Post';

  fetchAllPosts();
}

/*************************************************
 * 6️⃣ POSTS — PUBLICAR / EXCLUIR
 *************************************************/

async function togglePublish(postId, isPublished) {
  const endpoint = isPublished ? 'unpublish' : 'publish';

  await fetch(`https://blog-api-m84c.onrender.com/posts/${postId}/${endpoint}`, {
    method: 'PUT',
    headers: { Authorization: `Bearer ${token}` },
  });

  fetchAllPosts();
}

async function deletePost(postId) {
  if (!confirm('Tem certeza que deseja excluir este post?')) return;

  const res = await fetch(`https://blog-api-m84c.onrender.com/posts/${postId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  if (!res.ok) {
    const data = await res.json();
    alert(data.error || 'Não é possível excluir posts com comentários');
    return;
  }

  fetchAllPosts();
}

/*************************************************
 * 7️⃣ COMENTÁRIOS — LISTAR
 *************************************************/

async function fetchAllComments() {
  try {
    const res = await fetch('https://blog-api-m84c.onrender.com/comments', {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) throw new Error();

    const comments = await res.json();

    commentsTable.innerHTML = comments
      .map(
        (comment) => `
        <tr>
          <td>${comment.username}</td>
          <td>${comment.content}</td>
          <td>${comment.post.title}</td>
          <td>
            <button onclick="deleteComment(${comment.id})">Excluir</button>
          </td>
        </tr>
      `
      )
      .join('');
  } catch {
    commentsTable.innerHTML =
      '<tr><td colspan="5">Erro ao carregar comentários</td></tr>';
  }
}

/*************************************************
 * 8️⃣ COMENTÁRIOS — MODERAR
 *************************************************/

async function deleteComment(commentId) {
  if (!confirm('Deseja excluir este comentário?')) return;

  await fetch(`https://blog-api-m84c.onrender.com/comments/${commentId}`, {
    method: 'DELETE',
    headers: { Authorization: `Bearer ${token}` },
  });

  fetchAllComments();
}

/*************************************************
 * 9️⃣ INIT
 *************************************************/

fetchAllPosts();
fetchAllComments();