const express = require('express');
const router = express.Router();
const supabase = require('../db');
const axios = require('axios');

// Get documents for a client
router.get('/:clientId', async (req, res) => {
    const { clientId } = req.params;
    const { data: documents, error } = await supabase.from('documents').select('*').eq('client_id', clientId);
    if (error) return res.status(500).send(error);
    res.send(documents || []);
});

// Webhook to receive document from n8n
router.post('/webhook', async (req, res) => {
    const { client_id, tipo, file_url, file_name } = req.body;

    if (!file_url) {
        return res.status(400).send('Missing file_url');
    }

    try {
        // Download the file from the temporary URL
        const response = await axios.get(file_url, { responseType: 'arraybuffer' });
        const buffer = Buffer.from(response.data, 'binary');

        // Clean filename
        const cleanName = (file_name || `${tipo || 'document'}_${Date.now()}.pdf`).replace(/[\r\n\s]+/g, '_').trim();
        const fileName = `${Date.now()}-${cleanName}`;

        // Upload to Supabase Storage 'documents' bucket
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('documents')
            .upload(fileName, buffer, {
                contentType: 'application/pdf',
                upsert: false
            });

        if (uploadError) {
            console.error('Error uploading document to storage:', uploadError);
            return res.status(500).send(uploadError);
        }

        // Generate public URL
        const { data: publicUrlData } = supabase.storage.from('documents').getPublicUrl(fileName);
        const publicUrl = publicUrlData.publicUrl;

        // Insert record in 'documents' table
        const { data: dbData, error: dbError } = await supabase
            .from('documents')
            .insert([{ 
                client_id: client_id || null, 
                name: file_name || `${tipo === 'factura' ? 'Factura' : 'Oferta'}`, 
                url: publicUrl 
            }])
            .select()
            .single();

        if (dbError) {
            console.error('Error inserting document record:', dbError);
            return res.status(500).send(dbError);
        }

        res.status(201).send(dbData);
    } catch (err) {
        console.error('Error processing webhook document:', err.message);
        res.status(500).send('Error processing document');
    }
});

// Delete a document
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Get the document record
    const { data: document, error: fetchError } = await supabase
        .from('documents')
        .select('*')
        .eq('id', id)
        .single();

    if (document) {
        // Extract filename from URL
        const urlParts = document.url.split('/');
        const filename = urlParts[urlParts.length - 1];

        // Delete from Supabase Storage
        await supabase.storage.from('documents').remove([decodeURIComponent(filename)]);

        // Delete from database
        await supabase.from('documents').delete().eq('id', id);
    }

    res.status(204).send();
});

module.exports = router;
