// ==========================================
// MÓDULO COCINA
// ==========================================

let filtroActual = 'todos';

// find() busca un pedido específico por su ID para actualizar su estado
function changeOrderStatus(id, nuevoEstado) {
    const pedidos = getOrders();

    // find() localiza el pedido exacto
    const pedido = pedidos.find(p => p.id === id);

    if (pedido) {
        pedido.estado = nuevoEstado;
        saveOrders(pedidos);
        renderKitchenOrders(filtroActual);
    }
}
window.changeOrderStatus = changeOrderStatus;

// Renderizar las comandas de cocina con soporte de filtros
function renderKitchenOrders(filtro = 'todos') {
    filtroActual = filtro;
    const contenedor = document.getElementById('cocina-pedidos');
    if (!contenedor) return;

    const pedidos = getOrders();

    // filter() obtiene únicamente los pedidos que coinciden con el estado seleccionado
    const pedidosFiltrados = filtro === 'todos'
        ? pedidos
        : pedidos.filter(pedido => pedido.estado === filtro);

    contenedor.innerHTML = '';

    if (pedidosFiltrados.length === 0) {
        contenedor.innerHTML = '<p>No hay pedidos en este estado.</p>';
        return;
    }

    pedidosFiltrados.forEach(pedido => {
        const card = document.createElement('article');
        card.className = 'pedido-cocina';

        let productosHTML = '';
        pedido.productos.forEach(prod => {
            productosHTML += `<li>${prod.name}</li>`;
        });

        // Botones para cambiar el estado según el ciclo: pendiente -> preparando -> listo
        let accionesHTML = '';
        if (pedido.estado === 'pendiente') {
            accionesHTML = `
                <button type="button" class="btn-estado" onclick="changeOrderStatus(${pedido.id}, 'preparando')">
                    Iniciar Preparación
                </button>
            `;
        } else if (pedido.estado === 'preparando') {
            accionesHTML = `
                <button type="button" class="btn-estado btn-listo" onclick="changeOrderStatus(${pedido.id}, 'listo')">
                    Marcar como Listo
                </button>
            `;
        } else if (pedido.estado === 'listo') {
            accionesHTML = `<span class="badge-completado">✓ Listo para entrega</span>`;
        }

        card.innerHTML = `
            <div class="pedido-cocina-header">
                <h3>Comanda #${pedido.id}</h3>
                <span class="badge-estado estado-${pedido.estado}">${pedido.estado}</span>
            </div>
            <h4>Artículos a preparar:</h4>
            <ul>${productosHTML}</ul>
            <div class="acciones-cocina">
                ${accionesHTML}
            </div>
        `;

        contenedor.appendChild(card);
    });
}

// Inicializar la vista de Cocina y eventos de filtro
document.addEventListener('DOMContentLoaded', () => {
    renderKitchenOrders();

    const botonesFiltro = document.querySelectorAll('#filtros-cocina button');
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            e.target.classList.add('activo');
            const filtro = e.target.getAttribute('data-filtro');
            renderKitchenOrders(filtro);
        });
    });
});
