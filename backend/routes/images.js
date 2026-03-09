const express = require('express');
const router = express.Router();
const multer = require('multer');
const supabase = require('../db');

// Use memory storage for Multer to get the file buffer directly
const storage = multer.memoryStorage();
const upload = multer({ storage });

// Get images for a client
router.get('/:clientId', async (req, res) => {
    const { clientId } = req.params;
    const { data: images, error } = await supabase.from('images').select('*').eq('client_id', clientId);
    if (error) return res.status(500).send(error);
    res.send(images || []);
});

// Upload images
router.post('/:clientId', upload.array('photos'), async (req, res) => {
    const { clientId } = req.params;
    const files = req.files;
    if (!files || files.length === 0) return res.status(400).send('No files uploaded');

    const results = [];

    for (const file of files) {
        // Clean filename to avoid issues in storage
        const cleanName = file.originalname.replace(/[\r\n\s]+/g, '_').trim();
        const fileName = `${Date.now()}-${cleanName}`;

        // Upload to Supabase Storage 'images' bucket
        const { data: uploadData, error: uploadError } = await supabase
            .storage
            .from('images')
            .upload(fileName, file.buffer, {
                contentType: file.mimetype,
                upsert: false
            });

        if (uploadError) {
            console.error('Error uploading file to storage:', uploadError);
            continue; // Skip this file and try the next one
        }

        // Insert record in 'images' table
        const { data: dbData, error: dbError } = await supabase
            .from('images')
            .insert([{ client_id: clientId, filename: fileName }])
            .select()
            .single();

        if (dbError) {
            console.error('Error inserting image record:', dbError);
            continue;
        }

        results.push(dbData);
    }

    res.status(201).send(results);
});

// Delete an image
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    // Get the image record to know the filename
    const { data: image, error: fetchError } = await supabase
        .from('images')
        .select('*')
        .eq('id', id)
        .single();

    if (image) {
        // Delete from Supabase Storage
        await supabase.storage.from('images').remove([image.filename]);

        // Delete from database
        await supabase.from('images').delete().eq('id', id);
    }

    res.status(204).send();
});

module.exports = router;
