document.addEventListener('DOMContentLoaded', function() {
    console.log("El sitio está cargado y listo.");

    // Función para cargar contenido dinámico
    function loadSection(url, elementId) {
        fetch(url)
            .then(response => response.text())
            .then(data => {
                document.getElementById(elementId).innerHTML = data;
            })
            .catch(error => console.error('Error al cargar la sección:', error));
    }

    // Cargar la sección de héroe por defecto
    loadSection('/sections/hero', 'main-content');

    // Agregar eventos a los enlaces del menú
    document.querySelectorAll('nav ul li a').forEach(link => {
        link.addEventListener('click', function(event) {
            event.preventDefault();
            const section = this.getAttribute('href');
            if (section.startsWith('/sections')) {
                loadSection(section, 'main-content');
            } else if (section === '#admin') {
                document.getElementById('main-content').innerHTML = document.getElementById('admin').outerHTML;
                loadAdminProducts();
            }
        });
    });

    // Variables y elementos del DOM
    const productForm = document.getElementById('product-form');
    const adminProductList = document.getElementById('admin-product-list');
    const productIdInput = document.getElementById('product-id');
    const productNameInput = document.getElementById('product-name');
    const productPriceInput = document.getElementById('product-price');
    const productImageInput = document.getElementById('product-image');
    const productDescriptionInput = document.getElementById('product-description');

    // Función para renderizar productos
    function renderProducts(products, listElement) {
        listElement.innerHTML = '';
        products.forEach(product => {
            const li = document.createElement('li');
            li.innerHTML = `
                <img src="${product.image}" alt="${product.name}" width="50">
                <strong>${product.name}</strong> - $${product.price}
                <p>${product.description}</p>
                ${listElement === adminProductList ? `
                <button onclick="editProduct(${product.id})">Editar</button>
                <button onclick="deleteProduct(${product.id})">Eliminar</button>
                ` : ''}
            `;
            listElement.appendChild(li);
        });
    }

    // Función para cargar productos
    function loadProducts(listElement) {
        fetch('/api/products')
            .then(response => response.json())
            .then(data => {
                renderProducts(data, listElement);
            })
            .catch(error => console.error('Error al cargar productos:', error));
    }

    // Función para cargar productos en la página de inicio
    function loadHomeProducts() {
        loadProducts(document.getElementById('product-list'));
    }

    // Función para cargar productos en la sección de administración
    function loadAdminProducts() {
        loadProducts(adminProductList);
    }

    // Función para guardar producto
    productForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const id = productIdInput.value;
        const product = {
            name: productNameInput.value,
            price: parseFloat(productPriceInput.value),
            image: productImageInput.value,
            description: productDescriptionInput.value,
        };

        const method = id ? 'PUT' : 'POST';
        const url = id ? `/api/products/${id}` : '/api/products';
        
        fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(product),
        })
        .then(response => response.json())
        .then(data => {
            loadAdminProducts();
            productForm.reset();
        })
        .catch(error => console.error('Error al guardar producto:', error));
    });

    // Funciones para editar y eliminar producto
    window.editProduct = function(id) {
        fetch(`/api/products/${id}`)
            .then(response => response.json())
            .then(data => {
                productIdInput.value = data.id;
                productNameInput.value = data.name;
                productPriceInput.value = data.price;
                productImageInput.value = data.image;
                productDescriptionInput.value = data.description;
            })
            .catch(error => console.error('Error al cargar producto:', error));
    };

    window.deleteProduct = function(id) {
        fetch(`/api/products/${id}`, {
            method: 'DELETE',
        })
        .then(() => {
            loadAdminProducts();
        })
        .catch(error => console.error('Error al eliminar producto:', error));
    };

    // Cargar productos inicialmente
    loadHomeProducts();
});
