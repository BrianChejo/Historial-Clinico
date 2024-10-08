document.getElementById('medicoForm').addEventListener('submit', function(event) {
  event.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const especialidad = document.getElementById('especialidad').value;
  const horario = document.getElementById('horario').value;

  const medico = { nombre, especialidad, horario };

  // Enviar datos al backend
  fetch('/medicos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(medico),
  })
  .then(response => response.json())
  .then(data => {
    // Actualizar la lista de médicos
    alert('Médico registrado correctamente');
  })
  .catch(error => {
    console.error('Error al registrar médico:', error);
  });
});
