const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const productsFilePath = './productos.json';
const io = require('../server'); // Importamos socket.io

// POST /api/products (Crear producto y notificar a WebSockets)
router.post('/', async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    if (!title || !description || !code || !price || !stock || !category) {
        return res.status(400).send('Todos los campos son obligatorios');
    }

    try {
        const products = await fs.readJson(productsFilePath);
        const id = Date.now().toString();
        const newProduct = { id, title, description, code, price, stock, category, thumbnails: thumbnails || [] };

        products.push(newProduct);
        await fs.writeJson(productsFilePath, products);

        io.emit('actualizarLista', products); // Notificar a todos los clientes
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(500).send('Error al crear el producto');
    }
});

// DELETE /api/products/:pid (Eliminar producto y notificar a WebSockets)
router.delete('/:pid', async (req, res) => {
    const { pid } = req.params;

    try {
        let products = await fs.readJson(productsFilePath);
        products = products.filter(p => p.id !== pid);
        await fs.writeJson(productsFilePath, products);

        io.emit('productoEliminado', pid); // Notificar a todos los clientes
        res.status(204).send();
    } catch (error) {
        res.status(500).send('Error al eliminar el producto');
    }
});

module.exports = router;
