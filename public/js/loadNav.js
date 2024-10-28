document.addEventListener('DOMContentLoaded', function() {
  const navPlaceholder = document.getElementById('nav-placeholder');
  
  // Cargar el contenido de nav.html
  fetch('/nav.html')
    .then(response => {
      if (!response.ok) {
        throw new Error('Error al cargar la barra de navegación');
      }
      return response.text();
    })
    .then(data => {
      navPlaceholder.innerHTML = data;
    })
    .catch(error => console.error('Error cargando la navegación:', error));
});
