document.getElementById('loginForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const email = document.getElementById('email').value;
  const password = document.getElementById('password').value;

  const usuario = { email, password };

  try {
    const response = await fetch('/usuarios/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); // "Inicio de sesión exitoso"
      localStorage.setItem('rol', result.rol); // Guardar el rol del usuario en localStorage
      window.location.href = '/app.html'; // Redirigir a la página principal
    } else {
      alert('Error en el inicio de sesión: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión con el servidor');
  }
});
