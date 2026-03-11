const express = require('express');
const router = express.Router();
const supabase = require('../db');
const fs = require('fs');
const path = require('path');

const log = (msg) => {
    console.log(`${new Date().toISOString()} - ${msg}`);
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
    const { name, address, city, zip, phone, email, offer_num, offer_date, invoice_num, invoice_date, amount, ordered, man_num, order_date, stage, items, workItems } = req.body;

    try {
        const { data: client, error: clientError } = await supabase
            .from('clients')
            .insert([{
                name, address, city, zip, phone, email, offer_num, offer_date, invoice_num, invoice_date,
                amount, ordered: ordered ? 1 : 0, man_num, order_date, stage: stage || 'Sin presupuesto'
            }])
            .select()
            .single();

        if (clientError) throw clientError;

        const clientId = client.id;

        // Save offer items
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

        // Save work items
        if (workItems && Array.isArray(workItems)) {
            const validWork = workItems.filter(it => it.hours > 0 || (it.material_description && it.material_description.trim() !== '') || it.material_price > 0);
            if (validWork.length > 0) {
                const workToInsert = validWork.map(item => ({
                    client_id: clientId,
                    hours: parseFloat(item.hours) || 0,
                    material_description: item.material_description || '',
                    material_price: parseFloat(item.material_price) || 0
                }));
                const { error: workError } = await supabase.from('work_items').insert(workToInsert);
                if (workError) throw workError;
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
    const { name, address, city, zip, phone, email, offer_num, offer_date, invoice_num, invoice_date, amount, ordered, man_num, order_date, stage, items, workItems } = req.body;

    try {
        const { error: updateError } = await supabase
            .from('clients')
            .update({
                name, address, city, zip, phone, email, offer_num, offer_date, invoice_num, invoice_date,
                amount, ordered: ordered ? 1 : 0, man_num, order_date, stage
            })
            .eq('id', id);

        if (updateError) throw updateError;

        // Update offer items
        if (items && Array.isArray(items)) {
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

        // Update work items
        if (workItems && Array.isArray(workItems)) {
            await supabase.from('work_items').delete().eq('client_id', id);
            const validWork = workItems.filter(it => it.hours > 0 || (it.material_description && it.material_description.trim() !== '') || it.material_price > 0);
            if (validWork.length > 0) {
                const workToInsert = validWork.map(item => ({
                    client_id: id,
                    hours: parseFloat(item.hours) || 0,
                    material_description: item.material_description || '',
                    material_price: parseFloat(item.material_price) || 0
                }));
                await supabase.from('work_items').insert(workToInsert);
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

// Get client work items
router.get('/:id/work', async (req, res) => {
    const { id } = req.params;
    const { data: items, error } = await supabase.from('work_items').select('*').eq('client_id', id);
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
