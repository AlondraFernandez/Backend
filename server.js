const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const app = express();
const httpServer = app.listen(8080, () => console.log('✅ Servidor en http://localhost:8080'));
const io = new Server(httpServer);

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

let products = []; // Aquí deberías usar tu JSON en lugar de un array vacío

// Rutas
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { products });
});

// WebSockets
io.on('connection', (socket) => {
    console.log('🟢 Nuevo cliente conectado');
    socket.emit('updateProducts', products);

    socket.on('newProduct', (product) => {
        product.id = Date.now().toString(); // Generar ID
        products.push(product);
        io.emit('updateProducts', products);
    });
});
