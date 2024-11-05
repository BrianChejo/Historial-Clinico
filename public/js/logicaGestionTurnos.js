// Función para actualizar el estado de un turno
async function actualizarEstadoTurno(id, estado) {
  try {
    const response = await fetch(`/turnos/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ estado })
    });

    if (!response.ok) {
      throw new Error('Error al actualizar el estado del turno');
    }

    const result = await response.json();
    alert(result.message);
    cargarTurnos(); // Recargar la lista de turnos después de actualizar el estado
  } catch (error) {
    console.error('Error:', error);
    alert(error.message);
  }
}

document.addEventListener('DOMContentLoaded', async function() {
  const turnosList = document.getElementById('turnos-list');

  // Función para cargar los turnos pendientes
  async function cargarTurnos() {
    try {
      const response = await fetch('/turnos/pendientes');
      if (!response.ok) {
        throw new Error('Error al cargar los turnos');
      }
      const turnos = await response.json();

      turnosList.innerHTML = '';
      turnos.forEach(turno => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <td>${turno.paciente_nombre}</td>
          <td>${turno.fecha}</td>
          <td>${turno.hora}</td>
          <td>${turno.estado}</td>
          <td>
            <button class="btn btn-success btn-sm" onclick="actualizarEstadoTurno(${turno.id}, 'aprobado')">Aprobar</button>
            <button class="btn btn-danger btn-sm" onclick="actualizarEstadoTurno(${turno.id}, 'rechazado')">Rechazar</button>
          </td>
        `;
        turnosList.appendChild(row);
      });
    } catch (error) {
      console.error('Error:', error);
      alert(error.message);
    }
  }

  // Llamar a la función para cargar turnos al cargar la página
  cargarTurnos();
});
