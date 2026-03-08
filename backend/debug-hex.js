const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

const images = db.prepare('SELECT * FROM images').all();
console.log('--- Images Hex Dump ---');
images.forEach(img => {
    const hex = Buffer.from(img.filename).toString('hex');
    console.log(`ID: ${img.id} | ClientID: ${img.client_id} | Filename: "${img.filename}" | Hex: ${hex}`);
});
