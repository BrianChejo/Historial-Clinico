// public/js/logicaRegistro.js

document.getElementById('registroForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
  
    const usuario = { nombre, email, password };
  
    try {
      const response = await fetch('/usuarios/registro', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(usuario)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // "Registro exitoso"
        window.location.href = '/login.html'; // Redirige a la página de login
      } else {
        alert('Error en el registro: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });
  