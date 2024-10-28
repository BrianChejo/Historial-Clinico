document.getElementById('productoForm').addEventListener('submit', async function(event) {
    event.preventDefault();
  
    const nombre = document.getElementById('nombre').value;
    const dosis = document.getElementById('dosis').value;
    const efectos_secundarios = document.getElementById('efectos').value;
  
    const producto = { nombre, dosis, efectos_secundarios };
  
    try {
      const response = await fetch('/productos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(producto)
      });
  
      const result = await response.json();
  
      if (response.ok) {
        alert(result.message); // "Producto agregado con éxito"
        document.getElementById('productoForm').reset();
      } else {
        alert('Error al cargar producto: ' + result.error);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error de conexión con el servidor');
    }
  });
  