const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');
const db = new Database(path.join(__dirname, 'database.sqlite'));

const dbImages = db.prepare('SELECT filename FROM images').all().map(i => i.filename.trim());
const diskFiles = fs.readdirSync(path.join(__dirname, 'uploads'));

console.log('--- Consistency Check ---');
dbImages.forEach(dbImg => {
    const exists = diskFiles.includes(dbImg);
    console.log(`DB: "${dbImg}" | Exists on disk: ${exists}`);
});
