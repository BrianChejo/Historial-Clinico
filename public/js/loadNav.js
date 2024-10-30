// public/js/loadNav.js

document.addEventListener('DOMContentLoaded', function () {
  // Cargar el contenido de nav.html
  fetch('/nav.html')
    .then(response => {
      if (!response.ok) throw new Error('Network response was not ok');
      return response.text();
    })
    .then(data => {
      // Insertar el contenido de nav.html en el contenedor
      document.getElementById('nav-placeholder').innerHTML = data;

      // Obtener referencias a los elementos del menú
      const menuItems = document.getElementById('menu-items');
      const loginItem = document.getElementById('login-item');
      const registerItem = document.getElementById('register-item');
      const logoutItem = document.getElementById('logout-item');

      // Obtener el rol del usuario desde el almacenamiento local
      const rol = localStorage.getItem('rol');

      // Opciones generales visibles para todos
      menuItems.innerHTML = '<li class="nav-item"><a class="nav-link" href="app.html">Productos</a></li>';

      // Verificar el rol y mostrar las opciones correspondientes
      if (rol) {
        loginItem.style.display = 'none';
        registerItem.style.display = 'none';
        logoutItem.style.display = 'block';

        if (rol === 'paciente') {
          menuItems.innerHTML += `
            <li class="nav-item"><a class="nav-link" href="viewTurnos.html">Mis Turnos</a></li>
            <li class="nav-item"><a class="nav-link" href="viewRecordatorioMedicacion.html">Recordatorios de Medicación</a></li>
          `;
        } else if (rol === 'medico') {
          menuItems.innerHTML += `
            <li class="nav-item"><a class="nav-link" href="viewCargaProductos.html">Gestionar Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="viewafiliados.html">Mis Pacientes</a></li>
          `;
        } else if (rol === 'administrador') {
          menuItems.innerHTML += `
            <li class="nav-item"><a class="nav-link" href="viewMedicos.html">Gestionar Médicos</a></li>
            <li class="nav-item"><a class="nav-link" href="viewCargaProductos.html">Gestionar Productos</a></li>
            <li class="nav-item"><a class="nav-link" href="viewTurnos.html">Gestionar Turnos</a></li>
          `;
        }
      } else {
        loginItem.style.display = 'block';
        registerItem.style.display = 'block';
        logoutItem.style.display = 'none';
      }
    })
    .catch(error => console.error('Error al cargar el archivo de navegación:', error));
});

// Función de cierre de sesión
function logout() {
  localStorage.removeItem('rol'); // Eliminar rol del almacenamiento local
  window.location.href = 'login.html'; // Redirigir al login
}
