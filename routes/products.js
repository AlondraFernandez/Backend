const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const productsFilePath = './productos.json'; // Ruta para el archivo JSON

// GET /api/products
router.get('/', async (req, res) => {
  const { limit } = req.query;
  try {
    const products = await fs.readJson(productsFilePath);
    const limitedProducts = limit ? products.slice(0, parseInt(limit)) : products;
    res.json(limitedProducts);
  } catch (error) {
    res.status(500).send('Error al obtener los productos');
  }
});

// GET /api/products/:pid
router.get('/:pid', async (req, res) => {
  const { pid } = req.params;
  try {
    const products = await fs.readJson(productsFilePath);
    const product = products.find(p => p.id === pid);
    if (product) {
      res.json(product);
    } else {
      res.status(404).send('Producto no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al obtener el producto');
  }
});

// POST /api/products
router.post('/', async (req, res) => {
  const { title, description, code, price, stock, category, thumbnails } = req.body;
  if (!title || !description || !code || !price || !stock || !category) {
    return res.status(400).send('Todos los campos son obligatorios');
  }

  try {
    const products = await fs.readJson(productsFilePath);
    const id = Date.now().toString(); // Generar un ID único
    const newProduct = {
      id,
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails: thumbnails || [],
    };

    products.push(newProduct);
    await fs.writeJson(productsFilePath, products);
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).send('Error al crear el producto');
  }
});

// PUT /api/products/:pid
router.put('/:pid', async (req, res) => {
  const { pid } = req.params;
  const { title, description, code, price, stock, category, thumbnails } = req.body;

  try {
    const products = await fs.readJson(productsFilePath);
    const productIndex = products.findIndex(p => p.id === pid);
    if (productIndex === -1) {
      return res.status(404).send('Producto no encontrado');
    }

    const updatedProduct = {
      ...products[productIndex],
      title: title || products[productIndex].title,
      description: description || products[productIndex].description,
      code: code || products[productIndex].code,
      price: price || products[productIndex].price,
      stock: stock || products[productIndex].stock,
      category: category || products[productIndex].category,
      thumbnails: thumbnails || products[productIndex].thumbnails,
    };

    products[productIndex] = updatedProduct;
    await fs.writeJson(productsFilePath, products);
    res.json(updatedProduct);
  } catch (error) {
    res.status(500).send('Error al actualizar el producto');
  }
});

// DELETE /api/products/:pid
router.delete('/:pid', async (req, res) => {
  const { pid } = req.params;

  try {
    let products = await fs.readJson(productsFilePath);
    products = products.filter(p => p.id !== pid);
    await fs.writeJson(productsFilePath, products);
    res.status(204).send();
  } catch (error) {
    res.status(500).send('Error al eliminar el producto');
  }
});

module.exports = router;
