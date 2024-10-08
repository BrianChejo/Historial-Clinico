document.getElementById('turnoForm').addEventListener('submit', function (event) {
    event.preventDefault();
  
    const paciente = document.getElementById('paciente').value;
    const medico = document.getElementById('medico').value;
    const fecha = document.getElementById('fecha').value;
    const hora = document.getElementById('hora').value;
  
    const turno = { paciente, medico, fecha, hora };
  
    // Aquí agregarías la lógica para enviar la información al backend
  
    document.getElementById('turnoList').innerHTML += `<li>${paciente} - ${medico} - ${fecha} - ${hora}</li>`;
    document.getElementById('turnoForm').reset();
  });
  