const express = require('express');
const fs = require('fs-extra');
const router = express.Router();
const productsFilePath = './productos.json';

// Home - Lista de productos
router.get('/', async (req, res) => {
    try {
        const products = await fs.readJson(productsFilePath);
        res.render('home', { products });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

// Real-Time Products con WebSockets
router.get('/realtimeproducts', async (req, res) => {
    try {
        const products = await fs.readJson(productsFilePath);
        res.render('realTimeProducts', { products });
    } catch (error) {
        res.status(500).send('Error al obtener los productos');
    }
});

module.exports = router;
