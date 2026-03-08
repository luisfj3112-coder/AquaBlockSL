const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const db = require('../db');
const fs = require('fs');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = path.join(__dirname, '../uploads');
        if (!fs.existsSync(dir)) fs.mkdirSync(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const cleanName = file.originalname.replace(/[\r\n\s]+/g, '_').trim();
        cb(null, Date.now() + '-' + cleanName);
    }
});

const upload = multer({ storage });

// Get images for a client
router.get('/:clientId', (req, res) => {
    const { clientId } = req.params;
    const images = db.prepare('SELECT * FROM images WHERE client_id = ?').all(clientId);
    res.send(images);
});

// Upload images
router.post('/:clientId', upload.array('photos'), (req, res) => {
    const { clientId } = req.params;
    const files = req.files;
    if (!files) return res.status(400).send('No files uploaded');

    const stmt = db.prepare('INSERT INTO images (client_id, filename) VALUES (?, ?)');
    const results = files.map(file => {
        const info = stmt.run(clientId, file.filename);
        return { id: info.lastInsertRowid, client_id: clientId, filename: file.filename };
    });

    res.status(201).send(results);
});

// Delete an image
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    const image = db.prepare('SELECT * FROM images WHERE id = ?').get(id);
    if (image) {
        const filePath = path.join(__dirname, '../uploads', image.filename);
        if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        db.prepare('DELETE FROM images WHERE id = ?').run(id);
    }
    res.status(204).send();
});

module.exports = router;
