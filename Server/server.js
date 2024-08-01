const express = require('express');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Configura el servidor para servir archivos estáticos desde la carpeta 'public'
app.use(express.static(path.join(__dirname, 'public')));

// Rutas para las diferentes secciones
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/Server/public/sections/hero', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'hero.html'));
});

app.get('/Server/public/sections/about', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'about.html'));
});

app.get('/Server/public/sections/shop', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'shop.html'));
});

app.get('/Server/public/sections/contact', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'sections', 'contact.html'));
});

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
