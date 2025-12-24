const form = document.getElementById('login-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro no login');
      return;
    }

    // ✅ 1. Salva token
    localStorage.setItem('token', data.token);

    // (opcional, mas recomendado)
    localStorage.setItem('role', data.role || '');

    // ✅ 2. Redireciona para home
    window.location.href = 'index.html';

  } catch (error) {
    console.error(error);
    alert('Erro ao conectar com o servidor');
  }
});