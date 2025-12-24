const postsContainer = document.getElementById('posts-container');

// Botões de autenticação (existem no header)
const loginBtn = document.getElementById('login-btn');
const registerBtn = document.getElementById('register-btn');
const logoutBtn = document.getElementById('logout-btn');
const dashboardBtn = document.getElementById('dashboard-btn');

// Token salvo após login
const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

/**
 * CONTROLE DE UI (LOGIN / LOGOUT)
 */
if (token) {
  if (loginBtn) loginBtn.style.display = 'none';
  if (registerBtn) registerBtn.style.display = 'none';
  if (logoutBtn) logoutBtn.style.display = 'inline-block';
}

if (token && (role === 'ADMIN' || role === 'AUTHOR')) {
  if (dashboardBtn) dashboardBtn.style.display = 'inline-block';
}

if (logoutBtn) {
  logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    window.location.reload();
  });
}

/**
 * BUSCAR POSTS PUBLICADOS
 */
async function fetchPosts() {
  try {
    const res = await fetch('http://localhost:3000/posts');

    if (!res.ok) {
      throw new Error('Erro ao buscar posts');
    }

    const posts = await res.json();

    if (posts.length === 0) {
      postsContainer.innerHTML = '<p>Nenhum post publicado ainda.</p>';
      return;
    }

    postsContainer.innerHTML = posts
      .map(
        (post) => `
        <article class="post">
          <h2>${post.title}</h2>
          <p class="post-meta">
            Por: ${post.author.username} • 
            ${new Date(post.createdAt).toLocaleDateString()}
          </p>
          <p>${post.content.substring(0, 200)}...</p>
          <a class="read-more" href="post.html?id=${post.id}">
            Ler mais
          </a>
        </article>
      `
      )
      .join('');
  } catch (error) {
    console.error(error);
    postsContainer.innerHTML =
      '<p>Erro ao carregar posts. Tente novamente.</p>';
  }
}

// Inicializa
fetchPosts();