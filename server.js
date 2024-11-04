// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const helmet = require('helmet'); // agregar helmet
const path = require('path');
const db = require('./db');
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
// const errorHandler = require('./errorHandler');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet()); // agregar helmet
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/styles', express.static(path.join(__dirname, 'Styles')));
app.use('/js', express.static(path.join(__dirname, 'JS')));

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// agregar ruta 404
app.use((req, res) => {
  res.status(404).send('Ruta no encontrada');
});

// agregar middleware de error global
const errorHandler = require('./errorHandler');
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});