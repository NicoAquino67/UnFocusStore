const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const productsFilePath = path.join(__dirname, 'products.json');

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

// Leer productos desde el archivo JSON
function readProducts() {
  const data = fs.readFileSync(productsFilePath);
  return JSON.parse(data);
}

// Escribir productos en el archivo JSON
function writeProducts(products) {
  fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
}

// Actualizar el archivo shop.html
function updateShopHtml(products) {
  const shopHtmlPath = path.join(__dirname, 'public', 'sections', 'shop.html');
  const productHtml = products.map(product => `
    <div class="product">
      <img src="../${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.price}</p>
      <p>${product.description}</p>
    </div>
  `).join('\n');

  const shopHtmlContent = `
  <section id="shop" class="section">
    <div class="container">
      <h2>Nuestra Tienda</h2>
      ${productHtml}
    </div>
  </section>
  `;
  
  fs.writeFileSync(shopHtmlPath, shopHtmlContent);
}

// Inicializar el archivo shop.html con los productos iniciales
updateShopHtml(readProducts());

// Rutas para las diferentes secciones
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/sections/hero', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'hero.html'));
});

app.get('/sections/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'about.html'));
});

app.get('/sections/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'shop.html'));
});

app.get('/sections/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'contact.html'));
});

// API de productos
app.get('/api/products', (req, res) => {
  const products = readProducts();
  res.json(products);
});

app.post('/api/products', (req, res) => {
  const products = readProducts();
  const newProduct = {
    id: products.length ? products[products.length - 1].id + 1 : 1,
    name: req.body.name,
    price: req.body.price,
    image: req.body.image,
    description: req.body.description,
  };
  products.push(newProduct);
  writeProducts(products);
  updateShopHtml(products);
  res.status(201).json(newProduct);
});

app.put('/api/products/:id', (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const productIndex = products.findIndex(p => p.id === id);
  if (productIndex !== -1) {
    products[productIndex] = {
      id,
      name: req.body.name,
      price: req.body.price,
      image: req.body.image,
      description: req.body.description,
    };
    writeProducts(products);
    updateShopHtml(products);
    res.json(products[productIndex]);
  } else {
    res.status(404).send('Producto no encontrado');
  }
});

app.delete('/api/products/:id', (req, res) => {
  const products = readProducts();
  const id = parseInt(req.params.id);
  const newProducts = products.filter(p => p.id !== id);
  writeProducts(newProducts);
  updateShopHtml(newProducts);
  res.status(204).send();
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
