// public/js/logicaRecordatoriosPaciente.js

document.addEventListener('DOMContentLoaded', async function() {
    try {
      const response = await fetch('/recordatorios'); // Ruta para obtener los recordatorios
      const recordatorios = await response.json();
  
      if (response.ok) {
        const recordatoriosList = document.getElementById('recordatorios-list');
        recordatorios.forEach(recordatorio => {
          const listItem = document.createElement('li');
          listItem.classList.add('list-group-item');
          listItem.textContent = `Medicamento: ${recordatorio.medicamento} - Fecha: ${recordatorio.fecha} - Hora: ${recordatorio.hora}`;
          recordatoriosList.appendChild(listItem);
        });
      } else {
        alert('Error al cargar los recordatorios');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });
  