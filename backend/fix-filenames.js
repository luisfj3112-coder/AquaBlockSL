const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, 'database.sqlite'));

const uploadsDir = path.join(__dirname, 'uploads');
const diskFiles = fs.readdirSync(uploadsDir);
const dbImages = db.prepare('SELECT id, filename FROM images').all();

console.log('--- Fixing DB Filenames ---');
dbImages.forEach(img => {
    // Try to find a match on disk by cleaning everything
    const cleanedSearch = img.filename.replace(/[\r\n\s]+/g, '').trim();
    const match = diskFiles.find(f => f.replace(/[\r\n\s]+/g, '').trim() === cleanedSearch);

    if (match) {
        console.log(`ID: ${img.id} | Fixed: "${img.filename.replace(/[\r\n\s]+/g, ' ')}" -> "${match}"`);
        db.prepare('UPDATE images SET filename = ? WHERE id = ?').run(match, img.id);
    } else {
        console.log(`ID: ${img.id} | NO MATCH FOUND for "${img.filename.replace(/[\r\n\s]+/g, ' ')}"`);
    }
});
console.log('Done.');
