// Claves para el almacenamiento en localStorage
const PRODUCTS_KEY = 'coffeeshop-products';
const PROMOTION_KEY = 'coffeeshop-promotion';
const ORDERS_KEY = 'coffeeshop-orders';

// Lista inicial de productos
const defaultProducts = [
    {
        id: 'espresso',
        name: 'Espresso',
        description: 'Café intenso preparado al momento.',
        price: 50,
        category: 'Café',
        available: true
    },
    {
        id: 'cappuccino',
        name: 'Cappuccino',
        description: 'Espresso con leche vaporizada y espuma.',
        price: 65,
        category: 'Café',
        available: true
    },
    {
        id: 'chai',
        name: 'Té Chai',
        description: 'Té negro especiado con leche.',
        price: 55,
        category: 'Té',
        available: true
    },
    {
        id: 'croissant',
        name: 'Croissant',
        description: 'Croissant de mantequilla recién horneado.',
        price: 45,
        category: 'Panadería',
        available: true
    }
];

// Promoción inicial
const defaultPromotion = {
    title: 'Promoción del día',
    description: 'Disfruta un descuento especial en todos nuestros productos.',
    discount: 10,
    active: true
};

// Obtener productos de localStorage
function getProducts() {
    const guardados = localStorage.getItem(PRODUCTS_KEY);
    if (!guardados) {
        localStorage.setItem(PRODUCTS_KEY, JSON.stringify(defaultProducts));
        return defaultProducts;
    }
    return JSON.parse(guardados);
}

// Guardar productos en localStorage
function saveProducts(productos) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(productos));
}

// Obtener promoción de localStorage
function getPromotion() {
    const guardada = localStorage.getItem(PROMOTION_KEY);
    if (!guardada) {
        localStorage.setItem(PROMOTION_KEY, JSON.stringify(defaultPromotion));
        return defaultPromotion;
    }
    return JSON.parse(guardada);
}

// Guardar promoción en localStorage
function savePromotion(promocion) {
    localStorage.setItem(PROMOTION_KEY, JSON.stringify(promocion));
}

// Obtener pedidos de localStorage
function getOrders() {
    const guardados = localStorage.getItem(ORDERS_KEY);
    return guardados ? JSON.parse(guardados) : [];
}

// Guardar pedidos en localStorage
function saveOrders(pedidos) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(pedidos));
}

// Formatear precio para mostrar en pantalla
function formatPrice(precio) {
    return Number(precio).toFixed(2) + ' MXN';
}
