function guardarProductoCocina(productos, id, name, description, price, category) {
    if (!name || !description || !category || isNaN(price) || price < 0) {
        alert('Por favor completa todos los campos correctamente.');
        return false; // Avisamos que falló la validación
    }

    if (id) {
        const productoExistente = productos.find(prod => prod.id === id);
        if (!productoExistente) {
            alert('Producto no encontrado para editar.');
            return false; // Avisamos que no se encontró el producto
        }
        const productoEditado = productos.find(prod => prod.id === id);
        
        if (productoEditado) {
            productoEditado.name = name;
            productoEditado.description = description;
            productoEditado.price = price;
            productoEditado.category = category;
        }
    } else {
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

    contenedorPedidos.innerHTML = '';

    if (pedidos.length === 0) {
        contenedorPedidos.innerHTML = '<p>No hay pedidos pendientes en cocina.</p>';
        return;
    }

    pedidos.forEach(pedido => {
        // Le agregamos dos botones a cada pedido, cada uno manda un estado diferente
        contenedorPedidos.innerHTML += `
            <article class="pedido-tarjeta">
                <h3>Pedido #${pedido.id}</h3>
                <p>Mesa/Cliente: ${pedido.cliente}</p>
                
                <div class="acciones-cocina">
                    <button onclick="actualizarEstadoPedido(${pedido.id}, 'en_caja')">
                        Listo (Enviar a Caja)
                    </button>
                    <button onclick="actualizarEstadoPedido(${pedido.id}, 'cancelado_cocina')">
                        Rechazar (Sin insumos)
                    </button>
                </div>
            </article>
        `;
    });
}

function actualizarEstadoPedido(idPedido, nuevoEstado) {
    const todosLosPedidos = getOrders(); 
    
    const pedidoProcesado = todosLosPedidos.find(pedido => pedido.id === idPedido);

    if (pedidoProcesado) {

        pedidoProcesado.status = nuevoEstado; 
        
        saveOrders(todosLosPedidos); 
        renderPedidosCocina(); 
    }
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