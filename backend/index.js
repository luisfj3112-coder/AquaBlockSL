const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const imageRoutes = require('./routes/images');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/images', imageRoutes);

app.get('/', (req, res) => {
    res.send('CRM API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
