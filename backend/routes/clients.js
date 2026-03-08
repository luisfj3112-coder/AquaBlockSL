const express = require('express');
const router = express.Router();
const db = require('../db');
const fs = require('fs');
const path = require('path');

const logFile = 'C:\\Users\\Luis Relat\\Documents\\Programa_AQ\\backend\\debug.log';
const log = (msg) => {
    try {
        const entry = `${new Date().toISOString()} - ${msg}\n`;
        fs.appendFileSync(logFile, entry);
        console.log(msg);
    } catch (e) {
        console.error('Logging failed:', e);
    }
};

// Get all clients
router.get('/', (req, res) => {
    const clients = db.prepare(`
        SELECT c.*, 
        (SELECT GROUP_CONCAT(filename) FROM images WHERE client_id = c.id) as images_list
        FROM clients c
    `).all();
    res.send(clients);
});

// Add new client
router.post('/', (req, res) => {
    log(`POST /clients - Body: ${JSON.stringify(req.body)}`);
    const { name, address, city, zip, phone, email, offer_num, offer_date, amount, ordered, man_num, order_date, stage, items } = req.body;

    const insertClient = db.prepare(`
        INSERT INTO clients (name, address, city, zip, phone, email, offer_num, offer_date, amount, ordered, man_num, order_date, stage)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const insertItem = db.prepare(`
        INSERT INTO offer_items (client_id, description, price)
        VALUES (?, ?, ?)
    `);

    try {
        const transaction = db.transaction(() => {
            const info = insertClient.run(name, address, city, zip, phone, email, offer_num, offer_date, amount, ordered ? 1 : 0, man_num, order_date, stage || 'Sin presupuesto');
            const clientId = info.lastInsertRowid;

            if (items && Array.isArray(items)) {
                const validItems = items.filter(it => (it.description && it.description.trim() !== '') || (it.price > 0));
                for (const item of validItems) {
                    insertItem.run(clientId, item.description || '', item.price || 0);
                }
            }
            return clientId;
        });

        const clientId = transaction();
        res.status(201).send({ id: clientId, ...req.body });
    } catch (err) {
        console.error('Error adding client:', err);
        res.status(500).send({ error: 'Failed to add client' });
    }
});

// Update client
router.put('/:id', (req, res) => {
    const { id } = req.params;
    log(`PUT /clients/${id} - Body: ${JSON.stringify(req.body)}`);
    const { name, address, city, zip, phone, email, offer_num, offer_date, amount, ordered, man_num, order_date, stage, items } = req.body;

    console.log(`[DEBUG] Updating client ${id}. Items received:`, items ? items.length : 'none');

    const updateClient = db.prepare(`
        UPDATE clients SET name=?, address=?, city=?, zip=?, phone=?, email=?, offer_num=?, offer_date=?, amount=?, ordered=?, man_num=?, order_date=?, stage=?
        WHERE id=?
    `);

    const deleteItems = db.prepare('DELETE FROM offer_items WHERE client_id = ?');
    const insertItem = db.prepare('INSERT INTO offer_items (client_id, description, price) VALUES (?, ?, ?)');

    try {
        const transaction = db.transaction(() => {
            console.log(`[DEBUG] Executing transaction for client ${id}`);
            const info = updateClient.run(name, address, city, zip, phone, email, offer_num, offer_date, amount, ordered ? 1 : 0, man_num, order_date, stage, id);

            if (info.changes === 0) throw new Error('Client not found');

            if (items && Array.isArray(items)) {
                console.log(`[DEBUG] Deleting old items for client ${id}`);
                deleteItems.run(id);
                const validItems = items.filter(it => (it.description && it.description.trim() !== '') || (it.price > 0));
                console.log(`[DEBUG] Inserting ${validItems.length} valid items for client ${id}`);
                for (const item of validItems) {
                    insertItem.run(id, item.description || '', item.price || 0);
                }
            }
        });

        transaction();
        console.log(`[DEBUG] Transaction committed for client ${id}`);
        res.send({ id, ...req.body });
    } catch (err) {
        console.error('[ERROR] Error updating client:', err);
        res.status(500).send({ error: 'Failed to update client', details: err.message });
    }
});

// Get client items
router.get('/:id/items', (req, res) => {
    const { id } = req.params;
    const items = db.prepare('SELECT * FROM offer_items WHERE client_id = ?').all(id);
    res.send(items);
});

// Update client stage (for drag & drop)
router.patch('/:id/stage', (req, res) => {
    const { id } = req.params;
    const { stage } = req.body;
    db.prepare('UPDATE clients SET stage = ? WHERE id = ?').run(stage, id);
    res.send({ id, stage });
});

// Delete client
router.delete('/:id', (req, res) => {
    const { id } = req.params;
    db.prepare('DELETE FROM clients WHERE id = ?').run(id);
    res.status(204).send();
});

module.exports = router;
