const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

const clients = db.prepare(`
    SELECT c.id, c.name, GROUP_CONCAT(i.filename) as images_list
    FROM clients c
    LEFT JOIN images i ON c.id = i.client_id
    GROUP BY c.id
`).all();

console.log('--- Clients and Images ---');
clients.forEach(c => {
    console.log(`ID: ${c.id} | Name: ${c.name} | Images: ${c.images_list}`);
});

const images = db.prepare('SELECT * FROM images').all();
console.log('\n--- All Images ---');
images.forEach(img => {
    console.log(`ID: ${img.id} | ClientID: ${img.client_id} | Filename: ${img.filename}`);
});
