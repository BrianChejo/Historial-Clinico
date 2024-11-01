document.addEventListener('DOMContentLoaded', async function() {
    try {
      const response = await fetch('/medicos/pacientes');
      const pacientes = await response.json();
  
      if (response.ok) {
        const pacientesList = document.getElementById('pacientes-list');
        pacientesList.innerHTML = ''; // Limpiar la lista antes de agregar pacientes
  
        pacientes.forEach(paciente => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.textContent = `Nombre: ${paciente.nombre} - DNI: ${paciente.dni}`;
          pacientesList.appendChild(listItem);
        });
      } else {
        alert('Error al cargar los pacientes');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });
  