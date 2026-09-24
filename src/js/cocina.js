function guardarProductoCocina(productos, id, name, description, price, category) {
    if (!name || !description || !category || isNaN(price) || price < 0) {
        alert('Por favor completa todos los campos correctamente.');
        return false; // Avisamos que falló la validación
    }

    if (id) {
        // Usamos find() para buscar el producto exacto por su id
        const productoEditado = productos.find(prod => prod.id === id);
        
        if (productoEditado) {
            productoEditado.name = name;
            productoEditado.description = description;
            productoEditado.price = price;
            productoEditado.category = category;
        }
    } else {
        // Es nuevo: agregamos al array
        const nuevoProducto = {
            id: String(Date.now()),
            name: name,
            description: description,
            price: price,
            category: category,
            available: true
        };
        productos.push(nuevoProducto);
    }

    return true; // Avisamos que se guardó con éxito
}

function obtenerPedidosparaCocina() {
    const pedidos = getOrders();
    const pedidosPendientes = pedidos.filter(pedido => pedido.status === 'pendiente');
    return pedidosPendientes;
}

function renderPedidosCocina() {
    const pedidos = obtenerPedidosparaCocina();
    const contenedorPedidos = document.getElementById('pedidos-cocina');
}

//Lógica de los botones con filter()
document.addEventListener('DOMContentLoaded', () => {
    const botonesFiltro = document.querySelectorAll('#filtros-menu button');
    
    if (botonesFiltro.length === 0) return; 

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            e.target.classList.add('activo');

            const filtro = e.target.getAttribute('data-filtro');
            const todosLosProductos = getProducts();
            let productosFiltrados = [];

            if (filtro === 'todos') {
                productosFiltrados = todosLosProductos;
            } 
            else if (filtro === 'bebidas') {
                productosFiltrados = todosLosProductos.filter(prod => prod.category === 'Café' || prod.category === 'Té');
            } 
            else if (filtro === 'postres') {
                productosFiltrados = todosLosProductos.filter(prod => prod.category === 'Panadería');
            } 
            else if (filtro === 'Precio mayor') {
                productosFiltrados = todosLosProductos.filter(prod => prod.price >= 4);
            } 
            else if (filtro === 'Precio menor') {
                productosFiltrados = todosLosProductos.filter(prod => prod.price < 4);
            }

            renderPublicMenu(productosFiltrados);
        });
    });
});