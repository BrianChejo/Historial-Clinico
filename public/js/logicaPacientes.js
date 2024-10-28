document.getElementById('pacienteForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const dni = document.getElementById('dni').value;
    const historial_clinico = document.getElementById('historial').value;
    const contacto_emergencia = document.getElementById('contacto').value;
  
    const paciente = { nombre, dni, historial_clinico, contacto_emergencia };
  
    try {
      const response = await fetch('/pacientes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(paciente)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // "Paciente agregado con éxito"
        document.getElementById('pacienteForm').reset();
      } else {
        alert('Error al registrar paciente: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });
  