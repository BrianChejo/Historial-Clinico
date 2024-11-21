document.addEventListener('DOMContentLoaded', () => {
    const usuariosTable = document.getElementById('usuariosTable').querySelector('tbody');
    const editRoleModal = new bootstrap.Modal(document.getElementById('editRoleModal')); // Inicializar el modal con Bootstrap
    const nuevoRolSelect = document.getElementById('nuevoRol');
    const guardarRolButton = document.getElementById('guardarRol');
    const cerrarModalButton = document.getElementById('cerrarModal');
    let usuarioSeleccionadoId = null;
  
    // Cargar usuarios
    const cargarUsuarios = async () => {
      try {
        const response = await fetch('/usuarios');
        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        const usuarios = await response.json();
  
        usuariosTable.innerHTML = ''; // Limpiar tabla
        usuarios.forEach((usuario) => {
          const row = document.createElement('tr');
  
          row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>${usuario.rol}</td>
            <td>
              <button class="editarRol" data-id="${usuario.id}" data-rol="${usuario.rol}">Editar Rol</button>
              <button class="eliminarUsuario" data-id="${usuario.id}">Eliminar</button>
            </td>
          `;
          usuariosTable.appendChild(row);
        });
  
        // Agregar eventos a los botones
        document.querySelectorAll('.editarRol').forEach((button) =>
          button.addEventListener('click', abrirModalEditarRol)
        );
        document.querySelectorAll('.eliminarUsuario').forEach((button) =>
          button.addEventListener('click', eliminarUsuario)
        );
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        alert('No se pudieron cargar los usuarios. Verifica la conexión con el servidor.');
      }
    };
  
    // Abrir modal para editar rol
    const abrirModalEditarRol = (event) => {
      usuarioSeleccionadoId = event.target.dataset.id;
      const rolActual = event.target.dataset.rol;
      nuevoRolSelect.value = rolActual;
  
      editRoleModal.show(); // Usar el método show() de Bootstrap para mostrar el modal
    };
  
    // Guardar nuevo rol
    guardarRolButton.addEventListener('click', async () => {
      const nuevoRol = nuevoRolSelect.value;
  
      try {
        const response = await fetch(`/usuarios/actualizar-rol/${usuarioSeleccionadoId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nuevoRol }),
        });
  
        if (response.ok) {
          alert('Rol actualizado correctamente');
          cargarUsuarios();
          editRoleModal.hide(); // Usar el método hide() de Bootstrap para ocultar el modal
        } else {
          alert('Error al actualizar el rol');
        }
      } catch (error) {
        console.error('Error al actualizar el rol:', error);
      }
    });
  
    // Eliminar usuario
    const eliminarUsuario = async (event) => {
      const usuarioId = event.target.dataset.id;
  
      try {
        const response = await fetch(`/usuarios/${usuarioId}`, { method: 'DELETE' });
  
        if (response.ok) {
          alert('Usuario eliminado correctamente');
          cargarUsuarios();
        } else {
          alert('Error al eliminar usuario');
        }
      } catch (error) {
        console.error('Error al eliminar usuario:', error);
      }
    };
  
    // Cerrar modal
    cerrarModalButton.addEventListener('click', () => {
      editRoleModal.hide(); // Usar el método hide() de Bootstrap para cerrar el modal
      usuarioSeleccionadoId = null;
    });
  
    // Inicializar tabla
    cargarUsuarios();
});
