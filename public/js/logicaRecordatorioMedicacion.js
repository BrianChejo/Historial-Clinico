document.getElementById('medicacionForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const paciente_id = document.getElementById('paciente').value;
    const producto_id = document.getElementById('medicamento').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('horario').value;
    const tipo = 'medicacion'; // tipo fijo para identificar que es un recordatorio de medicación
  
    const recordatorio = { paciente_id, producto_id, tipo, fecha, hora };
  
    try {
      const response = await fetch('/recordatorios', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recordatorio)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // "Recordatorio de medicación programado con éxito"
        document.getElementById('medicacionForm').reset();
      } else {
        alert('Error al programar recordatorio: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });
  