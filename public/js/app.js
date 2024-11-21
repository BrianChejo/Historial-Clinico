document.addEventListener('DOMContentLoaded', () => {
    const productosContainer = document.getElementById('productosContainer');

    // Cargar productos al iniciar
    cargarProductos();

    // Cargar productos desde el backend
    async function cargarProductos() {
        try {
            const token = localStorage.getItem('token');  // Obtener el token desde el localStorage
            const res = await fetch("/productos", {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`  // Incluir el token en los headers
                }
            });
  
            const productos = await res.json();
  
            // Verificar si la respuesta es un arreglo
            if (!Array.isArray(productos)) {
                throw new Error("La respuesta del servidor no es un arreglo");
            }
  
            // Limpiar el contenedor antes de agregar nuevos productos
            productosContainer.innerHTML = "";
  
            productos.forEach((producto) => {
                const card = document.createElement("div");
                card.classList.add("col");

                card.innerHTML = `
                    <div class="card shadow-sm">
                        <div class="card-body">
                            <h5 class="card-title">${producto.nombre}</h5>
                            <p class="card-text"><strong>Dosis:</strong> ${producto.dosis}</p>
                            <p class="card-text"><strong>Efectos secundarios:</strong> ${producto.efectos_secundarios}</p>
                        </div>
                    </div>
                `;

                productosContainer.appendChild(card);
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }
});
