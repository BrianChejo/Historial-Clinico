document.getElementById('medicoForm').addEventListener('submit', async function(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const especialidad = document.getElementById('especialidad').value;
  const horario = document.getElementById('horario').value;
  const contacto = document.getElementById('contacto').value;

  const medico = { nombre, especialidad, horario, contacto };

  try {
    const response = await fetch('/medicos', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(medico)
    });

    const result = await response.json();

    if (response.ok) {
      alert(result.message); // "Médico agregado con éxito"
      document.getElementById('medicoForm').reset();
    } else {
      alert('Error al registrar médico: ' + result.error);
    }
  } catch (error) {
    console.error('Error:', error);
    alert('Error de conexión con el servidor');
  }
});
