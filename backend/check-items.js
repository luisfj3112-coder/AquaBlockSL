const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
    const items = db.prepare('SELECT * FROM offer_items').all();
    console.log('--- Offer Items in DB ---');
    console.log(JSON.stringify(items, null, 2));

    const clients = db.prepare('SELECT id, name FROM clients').all();
    console.log('\n--- Clients in DB ---');
    console.log(JSON.stringify(clients, null, 2));
} catch (err) {
    console.error('Error reading DB:', err);
}
