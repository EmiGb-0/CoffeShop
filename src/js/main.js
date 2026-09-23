// Clave para guardar en localStorage
const PRODUCTS_KEY = 'coffeeshop-products';
const PROMOTION_KEY = 'coffeeshop-promotion';

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

const defaultPromotion = {

    title: 'Promoción del día',

    description:
        'Disfruta un descuento especial en todos nuestros productos.',

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
function saveProducts(lista) {
	localStorage.setItem(PRODUCTS_KEY, JSON.stringify(lista));
}

function getPromotion() {

    const guardada =
        localStorage.getItem(PROMOTION_KEY);

    if (!guardada) {

        localStorage.setItem(
            PROMOTION_KEY,
            JSON.stringify(defaultPromotion)
        );

        return defaultPromotion;
    }

    return JSON.parse(guardada);
}


function savePromotion(promocion) {

    localStorage.setItem(
        PROMOTION_KEY,
        JSON.stringify(promocion)
    );
}


// Formatear precio
function formatPrice(precio) {
	return precio.toFixed(2) + ' MXN';
}
function renderPromotion() {

    const contenedor =
        document.getElementById('promocion');

    if (!contenedor) {
        return;
    }


    const promocion =
        getPromotion();


    if (!promocion.active) {

        contenedor.innerHTML = '';

        contenedor.style.display = 'none';

        return;
    }


    contenedor.style.display = 'block';


    contenedor.innerHTML = `

        <span class="promocion-etiqueta">
            Promoción
        </span>

        <h2>
            ${promocion.title}
        </h2>

        <p>
            ${promocion.description}
        </p>

        <strong>
            ${promocion.discount}% de descuento
        </strong>

    `;
}


//Menú
function renderPublicMenu(listaProductos = getProducts()) {
    const menu = document.getElementById('menu');
    const select = document.getElementById('articulo');

    if (!menu || !select) return;

    menu.innerHTML = '';
    select.innerHTML = '<option value="">Selecciona un artículo</option>';

	const productosConPromocion = productos.map(producto => {
		let precioFinal =
			producto.price;


		if (promocion.active) {

			const descuento =
				producto.price *
				promocion.discount /
				100;


			precioFinal =
				producto.price -
				descuento;
		}


		return {

			...producto,

			finalPrice:
				precioFinal

		};

    });


    let hayProductos = false;


    // Filtramos solo los disponibles
    const disponibles = listaProductos.filter(prod => prod.available);
    let hayDisponibles = disponibles.length > 0;


	 productosConPromocion.forEach(
        producto => {


            // Producto no disponible
            if (!producto.available) {
                return;
            }


            hayProductos = true;


            let precioHTML = `

                <strong class="precio">
                    ${formatPrice(producto.price)}
                </strong>

            `;


            // Si la promoción está activa
            if (promocion.active) {

                precioHTML = `

                    <div class="precios">

                        <span class="precio-anterior">

                            ${formatPrice(
                                producto.price
                            )}

                        </span>


                        <strong class="precio-promocion">

                            ${formatPrice(
                                producto.finalPrice
                            )}

                        </strong>

                    </div>

                `;
            }


            menu.innerHTML += `

                <article class="producto">

                    <span class="categoria">
                        ${producto.category}
                    </span>


                    <h3>
                        ${producto.name}
                    </h3>


                    <p>
                        ${producto.description}
                    </p>


                    ${precioHTML}

                </article>

            `;


            select.innerHTML += `

                <option
                    value="${producto.id}"
                >

                    ${producto.name}
                    -
                    ${formatPrice(
                        producto.finalPrice
                    )}

                </option>

            `;

        }
    );
    if (hayDisponibles) {
        disponibles.forEach(prod => {
            // Agregar tarjeta al menu
            menu.innerHTML += `
                <article class="producto">
                    <h3>${prod.name}</h3>
                    <p>${prod.description}</p>
                    <strong>${formatPrice(prod.price)}</strong>
                </article>
            `;

            // Agregar opción al select
            select.innerHTML += `
                <option value="${prod.id}">${prod.name} - ${formatPrice(prod.price)}</option>
            `;
        });
    } else {
        menu.innerHTML = '<p>No hay productos disponibles en este momento.</p>';
        select.innerHTML = '<option value="">No hay productos disponibles</option>';
    }
}

function renderPromotionAdmin() {

    const form =
        document.getElementById(
            'promotion-form'
        );


    if (!form) {
        return;
    }


    const promocion =
        getPromotion();


    form.elements['title'].value =
        promocion.title;


    form.elements['description'].value =
        promocion.description;


    form.elements['discount'].value =
        promocion.discount;


    form.elements['active'].checked =
        promocion.active;



    form.addEventListener(
        'submit',
        function(event) {

            event.preventDefault();


            const nuevaPromocion = {

                title:
                    form.elements[
                        'title'
                    ].value,

                description:
                    form.elements[
                        'description'
                    ].value,

                discount:
                    Number(
                        form.elements[
                            'discount'
                        ].value
                    ),

                active:
                    form.elements[
                        'active'
                    ].checked

            };


            savePromotion(
                nuevaPromocion
            );


            renderPromotion();

            renderPublicMenu();


            alert(
                'Promoción actualizada'
            );

        }
    );
}


function renderAdmin() {
	const productList = document.getElementById('admin-productos');
	const productForm = document.getElementById('producto-form');

	if (!productList || !productForm) return;

	// Inputs del formulario
	const idInput = productForm.querySelector('[name="id"]');
	const nameInput = productForm.querySelector('[name="name"]');
	const descInput = productForm.querySelector('[name="description"]');
	const priceInput = productForm.querySelector('[name="price"]');
	const catInput = productForm.querySelector('[name="category"]');
	const submitBtn = productForm.querySelector('button[type="submit"]');

	// Dibuja la lista del admin y asocia los botones
	function pintarAdmin() {
		const productos = getProducts();
		productList.innerHTML = '';

		for (let i = 0; i < productos.length; i++) {
			const prod = productos[i];
			const div = document.createElement('article');
			div.className = 'producto-admin' + (prod.available ? '' : ' producto-inactivo');

			div.innerHTML = `
				<div>
					<h3>${prod.name}</h3>
					<p>${prod.category} | ${formatPrice(prod.price)}</p>
					<small>${prod.available ? 'Disponible' : 'No disponible'}</small>
				</div>
				<div class="acciones">
					<button class="btn-toggle">${prod.available ? 'Ocultar' : 'Activar'}</button>
					<button class="btn-edit">Editar</button>
					<button class="btn-delete">Eliminar</button>
				</div>
			`;

			// Botón cambiar disponibilidad
			div.querySelector('.btn-toggle').onclick = function() {
				prod.available = !prod.available;
				saveProducts(productos);
				pintarAdmin();
				renderPublicMenu();
			};

			// Botón editar
			div.querySelector('.btn-edit').onclick = function() {
				idInput.value = prod.id;
				nameInput.value = prod.name;
				descInput.value = prod.description;
				priceInput.value = prod.price;
				catInput.value = prod.category;
				submitBtn.textContent = 'Actualizar producto';
			};

			// Botón borrar
			div.querySelector('.btn-delete').onclick = function() {
				productos.splice(i, 1);
				saveProducts(productos);
				pintarAdmin();
				renderPublicMenu();
			};

			productList.appendChild(div);
		}
	}

	// Enviar formulario (crear o editar)
	productForm.onsubmit = function(event) {
		event.preventDefault();

		const productos = getProducts();
		const id = idInput.value;
		const name = nameInput.value;
		const description = descInput.value;
		const price = parseFloat(priceInput.value);
		const category = catInput.value;

		if (!name || !description || !category || isNaN(price) || price < 0) {
			alert('Por favor completa todos los campos correctamente.');
			return;
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
        }
		
		 else {
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

		saveProducts(productos);
		productForm.reset();
		idInput.value = '';
		submitBtn.textContent = 'Guardar producto';

		pintarAdmin();
		renderPublicMenu();
	};

	pintarAdmin();
}

// Iniciar vistas
renderPromotion();
renderPublicMenu();
renderPromotionAdmin();
renderAdmin();



// Filtros de menú
document.addEventListener('DOMContentLoaded', () => {
    const botonesFiltro = document.querySelectorAll('#filtros-menu button');
    
    if (botonesFiltro.length === 0) return; 

    botonesFiltro.forEach(boton => {
        boton.addEventListener('click', (e) => {
            // Actualizar estado activo del botón
            botonesFiltro.forEach(btn => btn.classList.remove('activo'));
            e.target.classList.add('activo');

            const filtro = e.target.getAttribute('data-filtro');
            const todosLosProductos = getProducts();
            let productosFiltrados = [];

            // Aplicar filter() según el botón seleccionado
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
                productosFiltrados = todosLosProductos.filter(prod => prod.price >= 80);
            } 
            else if (filtro === 'Precio menor') {
                productosFiltrados = todosLosProductos.filter(prod => prod.price < 80);
            }

            // Actualizar la pantalla enviando la lista ya filtrada
            renderPublicMenu(productosFiltrados);
        });
    });
});