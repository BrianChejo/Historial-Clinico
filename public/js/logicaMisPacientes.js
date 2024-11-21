document.addEventListener('DOMContentLoaded', () => {
  const pacientesList = document.getElementById('pacientes-list');
  
  cargarPacientes();

  async function cargarPacientes() {
    try {
      const token = localStorage.getItem('token');

      const res = await fetch("/pacientes/todos", {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      });

      if (!res.ok) {
        throw new Error('Error al cargar los pacientes');
      }

      const pacientes = await res.json();

      if (pacientes.length === 0) {
        pacientesList.innerHTML = '<tr><td colspan="5" class="text-center">No hay pacientes para mostrar</td></tr>';
        return;
      }

      pacientesList.innerHTML = ''; // Limpiar la lista antes de cargar los pacientes

      pacientes.forEach((paciente) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${paciente.nombre}</td>
          <td>${paciente.dni}</td>
          <td>${paciente.email}</td>
          <td>${paciente.historial_clinico}</td>
          <td>${paciente.contacto_emergencia}</td>
        `;
        pacientesList.appendChild(row);
      });

    } catch (error) {
      console.error("Error al cargar los pacientes:", error);
      pacientesList.innerHTML = '<tr><td colspan="5" class="text-center text-danger">Error al cargar los pacientes</td></tr>';
    }
  }
});
