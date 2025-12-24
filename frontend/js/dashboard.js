/*************************************************
 * 1️⃣ PROTEÇÃO DO DASHBOARD (AUTH + ROLE)
 *************************************************/

// Token salvo no login
const token = localStorage.getItem('token');

if (!token) {
  window.location.href = '../login.html';
}

// Decodifica payload do JWT
const user = JSON.parse(atob(token.split('.')[1]));

// Apenas ADMIN ou AUTHOR podem acessar
if (user.role !== 'ADMIN' && user.role !== 'AUTHOR') {
  alert('Acesso negado');
  window.location.href = '../index.html';
}

/*************************************************
 * 2️⃣ LISTAR TODOS OS POSTS (PUBLICADOS OU NÃO)
 *************************************************/

const postsTable = document.getElementById('posts-table');

async function fetchAllPosts() {
  try {
    const res = await fetch('http://localhost:3000/posts/admin', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error('Erro ao buscar posts');
    }

    const posts = await res.json();

    postsTable.innerHTML = posts
      .map(
        (post) => `
        <tr>
          <td>${post.title}</td>
          <td>${post.author.username}</td>
          <td>${post.published ? 'Publicado' : 'Rascunho'}</td>
          <td>
            <button onclick="editPost(${post.id})">Editar</button>
            <button onclick="togglePublish(${post.id}, ${post.published})">
              ${post.published ? 'Despublicar' : 'Publicar'}
            </button>
            <button onclick="deletePost(${post.id})">Excluir</button>
          </td>
        </tr>
      `
      )
      .join('');
  } catch (err) {
    console.error(err);
    postsTable.innerHTML = '<tr><td colspan="4">Erro ao carregar posts</td></tr>';
  }
}

// Inicializa lista
fetchAllPosts();

/*************************************************
 * 3️⃣ CRIAR NOVO POST
 *************************************************/

const postForm = document.getElementById('post-form');
const titleInput = document.getElementById('title');
const contentInput = document.getElementById('content');

postForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    const res = await fetch('http://localhost:3000/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        title: titleInput.value,
        content: contentInput.value,
        authorId: user.id,
      }),
    });

    if (!res.ok) {
      throw new Error('Erro ao criar post');
    }

    postForm.reset();
    fetchAllPosts();
  } catch (err) {
    console.error(err);
    alert('Erro ao criar post');
  }
});

/*************************************************
 * 4️⃣ AÇÕES: PUBLICAR / DESPUBLICAR / DELETAR
 *************************************************/

async function togglePublish(postId, isPublished) {
  const endpoint = isPublished ? 'unpublish' : 'publish';

  await fetch(`http://localhost:3000/posts/${postId}/${endpoint}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchAllPosts();
}

async function deletePost(postId) {
  const confirmDelete = confirm('Tem certeza que deseja excluir este post?');
  if (!confirmDelete) return;

  await fetch(`http://localhost:3000/posts/${postId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  fetchAllPosts();
}

// (Opcional – Etapa 8.2)
function editPost(postId) {
  alert('Editar post será feito na próxima etapa 😉');
}