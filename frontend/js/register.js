const form = document.getElementById('register-form');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const username = document.getElementById('username').value;
  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  try {
    const res = await fetch('http://localhost:3000/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro ao registrar');
      return;
    }

    alert('Conta criada com sucesso!');

    // Redireciona para home
    window.location.href = 'index.html';
  } catch (err) {
    console.error(err);
    alert('Erro ao conectar com o servidor');
  }
});