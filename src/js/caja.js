// ==========================================
// MÓDULO CAJA
// ==========================================

// reduce() calcula el costo total de los productos de un pedido
function calculateTotal(productos) {
    return productos.reduce((acumulador, producto) => {
        return acumulador + producto.finalPrice;
    }, 0);
}

// Renderizar la lista de pedidos para consulta y cobro
function renderOrders() {
    const contenedor = document.getElementById('caja-pedidos');
    if (!contenedor) return;

    const pedidos = getOrders();
    contenedor.innerHTML = '';

    if (pedidos.length === 0) {
        contenedor.innerHTML = '<p>No hay pedidos registrados en el sistema.</p>';
        return;
    }

    pedidos.forEach(pedido => {
        // destructuring para obtener la información del pedido de manera clara y directa
        const { id, productos, estado } = pedido;

        // reduce() calcula el total a pagar
        const total = calculateTotal(productos);

        let itemsHTML = '';
        productos.forEach(producto => {
            // destructuring para obtener los datos de cada producto
            const { name, finalPrice } = producto;
            itemsHTML += `<li>${name} - ${formatPrice(finalPrice)}</li>`;
        });

        const card = document.createElement('article');
        card.className = 'pedido-caja';
        card.innerHTML = `
            <div class="pedido-caja-header">
                <h3>Pedido #${id}</h3>
                <span class="badge-estado estado-${estado}">${estado}</span>
            </div>
            <h4>Detalle del pedido:</h4>
            <ul>${itemsHTML}</ul>
            <p class="total-pedido">
                <strong>Total a cobrar:</strong> ${formatPrice(total)}
            </p>
        `;

        contenedor.appendChild(card);
    });
}

// Inicializar la vista de Caja
document.addEventListener('DOMContentLoaded', () => {
    renderOrders();
});
