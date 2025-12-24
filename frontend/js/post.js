const postContainer = document.getElementById('post-container');
const commentsList = document.getElementById('comments-list');
const commentForm = document.getElementById('comment-form');

const urlParams = new URLSearchParams(window.location.search);
const postId = urlParams.get('id');

async function fetchPost() {
  try {
    const res = await fetch(`http://localhost:3000/posts/${postId}`);
    const post = await res.json();

    postContainer.innerHTML = `
      <h2>${post.title}</h2>
      <p>Por: ${post.author.username} | ${new Date(post.createdAt).toLocaleDateString()}</p>
      <p>${post.content}</p>
    `;
  } catch (error) {
    postContainer.innerHTML = '<p>Erro ao carregar post.</p>';
    console.error(error);
  }
}

async function fetchComments() {
  try {
    const res = await fetch(`http://localhost:3000/comments/post/${postId}`);
    const comments = await res.json();

    commentsList.innerHTML = comments.map(c => `
      <div class="comment">
        <strong>${c.username}</strong> - ${new Date(c.createdAt).toLocaleDateString()}
        <p>${c.content}</p>
      </div>
    `).join('');
  } catch (error) {
    commentsList.innerHTML = '<p>Erro ao carregar comentários.</p>';
    console.error(error);
  }
}

// Criar comentário
commentForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const content = document.getElementById('content').value;

  try {
    const res = await fetch(`http://localhost:3000/comments/${postId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, content, postId: Number(postId) })
    });

    if (res.ok) {
      fetchComments(); // Atualiza comentários
      commentForm.reset();
    } else {
      console.error('Erro ao criar comentário');
    }
  } catch (error) {
    console.error(error);
  }
});

// Inicializa
fetchPost();
fetchComments();