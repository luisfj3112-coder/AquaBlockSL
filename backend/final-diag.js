const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, 'database.sqlite'));

const images = db.prepare('SELECT id, filename FROM images').all();
const uploads = fs.readdirSync(path.join(__dirname, 'uploads'));

console.log('--- DB VS DISK ---');
images.forEach(img => {
    const cleaned = img.filename.replace(/[\r\n\s]+/g, ' ').trim();
    console.log(`ID: ${img.id}`);
    console.log(`  Raw Length: ${img.filename.length}`);
    console.log(`  Cleaned: "${cleaned}"`);

    // Check if any file on disk matches the CLEANED version or the RAW version
    const rawMatch = uploads.includes(img.filename);
    const cleanedMatch = uploads.some(u => u.replace(/[\r\n\s]+/g, ' ').trim() === cleaned);

    console.log(`  Raw Match: ${rawMatch}`);
    console.log(`  Cleaned Match: ${cleanedMatch}`);
});

console.log('\n--- DISK FILES ---');
uploads.forEach(u => console.log(`  "${u}"`));
