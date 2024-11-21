document.addEventListener("DOMContentLoaded", () => {
    const productoForm = document.getElementById("productoForm");
    const productosTable = document.getElementById("productosTable").querySelector("tbody");
  
    // Cargar productos al iniciar
    cargarProductos();
  
    // Manejar el formulario para crear o actualizar producto
    productoForm.addEventListener("submit", async (e) => {
        e.preventDefault();
  
        const id = document.getElementById("productoId").value;
        const nombre = document.getElementById("nombre").value;
        const dosis = document.getElementById("dosis").value;
        const efectosSecundarios = document.getElementById("efectos_secundarios").value;
  
        const producto = { nombre, dosis, efectos_secundarios: efectosSecundarios };
  
        try {
            if (id) {
                // Actualizar producto
                await fetch(`/productos/${id}`, {
                    method: "PUT",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`  // Token de autenticación
                    },
                    body: JSON.stringify(producto)
                });
            } else {
                // Crear producto
                await fetch("/productos", {
                    method: "POST",
                    headers: { 
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${localStorage.getItem('token')}`  // Token de autenticación
                    },
                    body: JSON.stringify(producto)
                });
            }
            // Limpiar formulario y recargar productos
            productoForm.reset();
            cargarProductos();
        } catch (error) {
            console.error("Error al guardar el producto:", error);
        }
    });
  
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
  
            productosTable.innerHTML = "";
            productos.forEach((producto) => {
                const row = document.createElement("tr");
  
                row.innerHTML = `
                    <td>${producto.nombre}</td>
                    <td>${producto.dosis}</td>
                    <td>${producto.efectos_secundarios}</td>
                    <td>
                        <button onclick="editarProducto(${producto.id})">Editar</button>
                        <button onclick="eliminarProducto(${producto.id})">Eliminar</button>
                    </td>
                `;
  
                productosTable.appendChild(row);
            });
        } catch (error) {
            console.error("Error al cargar productos:", error);
        }
    }
  
    // Editar producto
    window.editarProducto = async (id) => {
        try {
            const res = await fetch(`/productos/${id}`, {
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`  // Incluir token
                }
            });
            if (!res.ok) throw new Error("Producto no encontrado");
            const producto = await res.json();
  
            document.getElementById("productoId").value = producto.id;
            document.getElementById("nombre").value = producto.nombre;
            document.getElementById("dosis").value = producto.dosis;
            document.getElementById("efectos_secundarios").value = producto.efectos_secundarios;
        } catch (error) {
            console.error("Error al editar producto:", error);
        }
    };
  
    // Eliminar producto
    window.eliminarProducto = async (id) => {
        try {
            const res = await fetch(`/productos/${id}`, { 
                method: "DELETE",
                headers: {
                    "Authorization": `Bearer ${localStorage.getItem('token')}`  // Incluir token
                }
            });
            if (!res.ok) throw new Error("Error al eliminar producto");
            cargarProductos();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
        }
    };
  });
  