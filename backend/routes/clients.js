const express = require('express');
const router = express.Router();
const supabase = require('../db');
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
router.get('/', async (req, res) => {
    try {
        const { data: clients, error: clientsError } = await supabase
            .from('clients')
            .select('*');

        if (clientsError) throw clientsError;

        const { data: images, error: imagesError } = await supabase
            .from('images')
            .select('*');

        if (imagesError) throw imagesError;

        // Group images locally to match previous response shape
        const clientsWithImages = clients.map(c => {
            const clientImages = images.filter(img => img.client_id === c.id);
            return {
                ...c,
                images_list: clientImages.map(img => img.filename).join(',') || null
            };
        });

        res.send(clientsWithImages);
    } catch (err) {
        console.error('Error fetching clients:', err);
        res.status(500).send({ error: 'Failed to fetch clients' });
    }
});

// Add new client
router.post('/', async (req, res) => {
    log(`POST /clients - Body: ${JSON.stringify(req.body)}`);
    const { name, address, city, zip, phone, email, offer_num, offer_date, amount, ordered, man_num, order_date, stage, items } = req.body;

    try {
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .insert([{
                name, address, city, zip, phone, email, offer_num, offer_date,
                amount, ordered: ordered ? 1 : 0, man_num, order_date, stage: stage || 'Sin presupuesto'
            }])
            .select()
            .single();

        if (clientError) throw clientError;

        const clientId = client.id;

        if (items && Array.isArray(items)) {
            const validItems = items.filter(it => (it.description && it.description.trim() !== '') || (it.price > 0));
            if (validItems.length > 0) {
                const itemsToInsert = validItems.map(item => ({
                    client_id: clientId,
                    description: item.description || '',
                    price: item.price || 0
                }));
                const { error: itemsError } = await supabase.from('offer_items').insert(itemsToInsert);
                if (itemsError) throw itemsError;
            }
        }

        res.status(201).send({ id: clientId, ...req.body });
    } catch (err) {
        console.error('Error adding client:', err);
        res.status(500).send({ error: 'Failed to add client' });
    }
});

// Update client
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    log(`PUT /clients/${id} - Body: ${JSON.stringify(req.body)}`);
    const { name, address, city, zip, phone, email, offer_num, offer_date, amount, ordered, man_num, order_date, stage, items } = req.body;

    try {
        const { error: updateError } = await supabase
            .from('clients')
            .update({
                name, address, city, zip, phone, email, offer_num, offer_date,
                amount, ordered: ordered ? 1 : 0, man_num, order_date, stage
            })
            .eq('id', id);

        if (updateError) throw updateError;

        if (items && Array.isArray(items)) {
            // Delete old items
            await supabase.from('offer_items').delete().eq('client_id', id);

            const validItems = items.filter(it => (it.description && it.description.trim() !== '') || (it.price > 0));
            if (validItems.length > 0) {
                const itemsToInsert = validItems.map(item => ({
                    client_id: id,
                    description: item.description || '',
                    price: item.price || 0
                }));
                await supabase.from('offer_items').insert(itemsToInsert);
            }
        }

        res.send({ id, ...req.body });
    } catch (err) {
        console.error('[ERROR] Error updating client:', err);
        res.status(500).send({ error: 'Failed to update client', details: err.message });
    }
});

// Get client items
router.get('/:id/items', async (req, res) => {
    const { id } = req.params;
    const { data: items, error } = await supabase.from('offer_items').select('*').eq('client_id', id);
    if (error) return res.status(500).send(error);
    res.send(items || []);
});

// Update client stage (for drag & drop)
router.patch('/:id/stage', async (req, res) => {
    const { id } = req.params;
    const { stage } = req.body;
    const { error } = await supabase.from('clients').update({ stage }).eq('id', id);
    if (error) return res.status(500).send(error);
    res.send({ id, stage });
});

// Delete client
router.delete('/:id', async (req, res) => {
    const { id } = req.params;
    const { error } = await supabase.from('clients').delete().eq('id', id);
    if (error) return res.status(500).send(error);
    res.status(204).send();
});

module.exports = router;
