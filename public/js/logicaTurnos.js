document.getElementById('turnoForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const paciente_id = document.getElementById('paciente').value;
  const medico_id = document.getElementById('medico').value;
  const fecha = document.getElementById('fecha').value;
  const hora = document.getElementById('hora').value;

  const turno = { paciente_id, medico_id, fecha, hora };

  try {
    const response = await fetch('/turnos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(turno)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); // "Turno agendado con éxito"
      document.getElementById('turnoForm').reset();
    } else {
      alert('Error al agendar turno: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión con el servidor');
  }
});
