const express = require('express');
const fs = require('fs-extra');
const app = express();
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');
const port = 8080;

app.use(express.json()); // Para parsear el body en formato JSON
app.use('/api/products', productsRouter); // Ruta para productos
app.use('/api/carts', cartsRouter); // Ruta para carritos

// Ruta raíz
app.get('/', (req, res) => {
  res.send('Servidor de e-commerce funcionando');
});

// Escuchar en el puerto 8080
app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
