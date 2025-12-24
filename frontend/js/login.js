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

    function parseJwt(token) {
      const base64Payload = token.split('.')[1];
      const payload = atob(base64Payload);
      return JSON.parse(payload);
    }
    
    const data = await res.json();

    if (!res.ok) {
      alert(data.error || 'Erro no login');
      return;
    }

    // Salva token
    localStorage.setItem('token', data.token);

    // 🔥 Extrai role do token
    const decoded = parseJwt(data.token);
    localStorage.setItem('role', decoded.role);

    // Redireciona
    window.location.href = 'index.html';
  } catch (error) {
    console.error(error);
    alert('Erro ao conectar com o servidor');
  }
});