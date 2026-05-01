const express = require('express');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
require('dotenv').config();

const db = require('./db');
const authRoutes = require('./routes/auth');
const clientRoutes = require('./routes/clients');
const imageRoutes = require('./routes/images');
const documentRoutes = require('./routes/documents');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/images', imageRoutes);
app.use('/api/documents', documentRoutes);

app.get('/', (req, res) => {
    res.send('CRM API is running');
});

// Conditionally listen if not running on Vercel
if (process.env.VERCEL) {
    console.log('Running on Vercel');
} else {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;
