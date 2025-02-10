// routes/carts.js

const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const cartsFilePath = './carrito.json'; // Ruta para el archivo JSON

// POST /api/carts
router.post('/', async (req, res) => {
  try {
    const carts = await fs.readJson(cartsFilePath);
    const id = Date.now().toString(); // Generar un ID único
    const newCart = { id, products: [] };
    carts.push(newCart);
    await fs.writeJson(cartsFilePath, carts);
    res.status(201).json(newCart);
  } catch (error) {
    res.status(500).send('Error al crear el carrito');
  }
});

// GET /api/carts/:cid
router.get('/:cid', async (req, res) => {
  const { cid } = req.params;
  try {
    const carts = await fs.readJson(cartsFilePath);
    const cart = carts.find(c => c.id === cid);
    if (cart) {
      res.json(cart.products);
    } else {
      res.status(404).send('Carrito no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al obtener el carrito');
  }
});

// POST /api/carts/:cid/product/:pid
router.post('/:cid/product/:pid', async (req, res) => {
  const { cid, pid } = req.params;

  try {
    const carts = await fs.readJson(cartsFilePath);
    const cart = carts.find(c => c.id === cid);
    if (!cart) {
      return res.status(404).send('Carrito no encontrado');
    }

    const product = { product: pid, quantity: 1 };
    const existingProduct = cart.products.find(p => p.product === pid);

    if (existingProduct) {
      existingProduct.quantity += 1;
    } else {
      cart.products.push(product);
    }

    await fs.writeJson(cartsFilePath, carts);
    res.status(201).json(cart.products);
  } catch (error) {
    res.status(500).send('Error al agregar el producto al carrito');
  }
});

module.exports = router;
