// ==========================================
// MÓDULO CLIENTE
// ==========================================

// Lista temporal con los artículos que el cliente va seleccionando
let pedidoActual = [];

// Mostrar la promoción si está activa
function renderPromotion() {
    const contenedor = document.getElementById('promocion');
    if (!contenedor) return;

    const promocion = getPromotion();

    if (!promocion || !promocion.active) {
        contenedor.innerHTML = '';
        contenedor.style.display = 'none';
        return;
    }

    contenedor.style.display = 'block';
    contenedor.innerHTML = `
        <span class="promocion-etiqueta">Promoción</span>
        <h2>${promocion.title}</h2>
        <p>${promocion.description}</p>
        <strong>${promocion.discount}% de descuento</strong>
    `;
}

// Renderizar el menú aplicando filtros y promociones
function renderMenu(filtro = 'todos') {
    const menu = document.getElementById('menu');
    if (!menu) return;

    const todosLosProductos = getProducts();
    const promocion = getPromotion();

    // 1. Filtrar productos según la categoría o criterio seleccionado
    let productosFiltrados = todosLosProductos;
    if (filtro === 'bebidas') {
        productosFiltrados = todosLosProductos.filter(p => p.category === 'Café' || p.category === 'Té');
    } else if (filtro === 'postres') {
        productosFiltrados = todosLosProductos.filter(p => p.category === 'Panadería');
    } else if (filtro === 'Precio mayor') {
        productosFiltrados = todosLosProductos.filter(p => p.price >= 60);
    } else if (filtro === 'Precio menor') {
        productosFiltrados = todosLosProductos.filter(p => p.price < 60);
    }

    // 2. map() transforma los productos calculando el precio final con descuento promocional
    const productosConPromocion = productosFiltrados.map(producto => {
        let precioFinal = producto.price;

        if (promocion && promocion.active) {
            const descuento = (producto.price * promocion.discount) / 100;
            precioFinal = producto.price - descuento;
        }

        return {
            ...producto,
            finalPrice: precioFinal
        };
    });

    // 3. forEach() recorre los productos transformados para mostrarlos en el menú
    menu.innerHTML = '';
    let hayProductosVisibles = false;

    productosConPromocion.forEach(producto => {
        // Los productos no disponibles no se muestran al cliente
        if (!producto.available) {
            return;
        }

        hayProductosVisibles = true;

        let precioHTML = `<strong class="precio">${formatPrice(producto.price)}</strong>`;

        if (promocion && promocion.active) {
            precioHTML = `
                <div class="precios">
                    <span class="precio-anterior">${formatPrice(producto.price)}</span>
                    <strong class="precio-promocion">${formatPrice(producto.finalPrice)}</strong>
                </div>
            `;
        }

        menu.innerHTML += `
            <article class="producto">
                <span class="categoria">${producto.category}</span>
                <h3>${producto.name}</h3>
                <p>${producto.description}</p>
                ${precioHTML}
            </article>
        `;
    });

    if (!hayProductosVisibles) {
        menu.innerHTML = '<p>No hay productos disponibles en esta categoría.</p>';
    }
}

// Llenar el selector de productos para hacer pedidos
function renderOrderSelect() {
    const select = document.getElementById('articulo');
    if (!select) return;

    const productos = getProducts();
    const promocion = getPromotion();

    // map() transforma la lista completa de productos para incluir el precio final
    const productosConPromocion = productos.map(producto => {
        let precioFinal = producto.price;
        if (promocion && promocion.active) {
            precioFinal = producto.price - (producto.price * promocion.discount / 100);
        }
        return {
            ...producto,
            finalPrice: precioFinal
        };
    });

    select.innerHTML = '<option value="">Selecciona un artículo</option>';

    // forEach() inserta cada producto disponible como una opción del select
    productosConPromocion.forEach(producto => {
        if (!producto.available) {
            return;
        }

        select.innerHTML += `
            <option value="${producto.id}">
                ${producto.name} - ${formatPrice(producto.finalPrice)}
            </option>
        `;
    });
}

// Mostrar los productos agregados al pedido actual
function renderCurrentOrder() {
    const lista = document.getElementById('lista-pedido');
    if (!lista) return;

    lista.innerHTML = '';

    if (pedidoActual.length === 0) {
        lista.innerHTML = '<li>No has seleccionado ningún artículo aún.</li>';
        return;
    }

    pedidoActual.forEach((item, index) => {
        const li = document.createElement('li');
        li.innerHTML = `
            <span>${item.name} - ${formatPrice(item.finalPrice)}</span>
            <button type="button" class="btn-quitar" onclick="removeProduct(${index})">✕</button>
        `;
        lista.appendChild(li);
    });
}

// Agregar producto seleccionado al pedido actual
function addProduct() {
    const select = document.getElementById('articulo');
    const productoId = select.value;

    if (!productoId) {
        alert('Por favor selecciona un artículo de la lista.');
        return;
    }

    const productos = getProducts();
    const promocion = getPromotion();
    const producto = productos.find(p => p.id === productoId);

    if (!producto) return;

    let precioFinal = producto.price;
    if (promocion && promocion.active) {
        precioFinal = producto.price - (producto.price * promocion.discount / 100);
    }

    pedidoActual.push({
        id: producto.id,
        name: producto.name,
        price: producto.price,
        finalPrice: precioFinal
    });

    renderCurrentOrder();
}

// Quitar un producto de la lista temporal
function removeProduct(index) {
    pedidoActual.splice(index, 1);
    renderCurrentOrder();
}
window.removeProduct = removeProduct;

// Crear el pedido formalmente y guardarlo en localStorage
function createOrder() {
    if (pedidoActual.length === 0) {
        alert('Agrega al menos un artículo antes de realizar el pedido.');
        return;
    }

    const nuevoPedido = {
        id: Date.now(),
        productos: [...pedidoActual],
        estado: 'pendiente'
    };

    const pedidos = getOrders();
    pedidos.push(nuevoPedido);
    saveOrders(pedidos);

    // Reiniciar pedido actual y selector
    pedidoActual = [];
    renderCurrentOrder();
    document.getElementById('articulo').value = '';

    alert(`¡Pedido #${nuevoPedido.id} realizado con éxito! Ha sido enviado a cocina.`);
}

// Inicialización de la vista Cliente
document.addEventListener('DOMContentLoaded', () => {
    renderPromotion();
    renderMenu();
    renderOrderSelect();
    renderCurrentOrder();

    // Eventos de los botones de filtro
    const botonesFiltro = document.querySelectorAll('#filtros-menu button');
    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            e.target.classList.add('activo');
            const filtro = e.target.getAttribute('data-filtro');
            renderMenu(filtro);
        });
    });

    // Eventos de botones para agregar y realizar pedido
    const btnAgregar = document.getElementById('btn-agregar');
    if (btnAgregar) {
        btnAgregar.addEventListener('click', addProduct);
    }

    const btnOrdenar = document.getElementById('btn-ordenar');
    if (btnOrdenar) {
        btnOrdenar.addEventListener('click', createOrder);
    }
});
