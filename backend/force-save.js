const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
    const clientId = 1;
    const items = [
        { description: 'Forced Item A', price: 100 },
        { description: 'Forced Item B', price: 200 }
    ];

    const transaction = db.transaction(() => {
        db.prepare('DELETE FROM offer_items WHERE client_id = ?').run(clientId);
        const stmt = db.prepare('INSERT INTO offer_items (client_id, description, price) VALUES (?, ?, ?)');
        for (const item of items) {
            stmt.run(clientId, item.description, item.price);
        }
    });

    transaction();
    console.log('Force save successful for ID 1');

    const saved = db.prepare('SELECT * FROM offer_items WHERE client_id = ?').all(clientId);
    console.log('Items now in DB for ID 1:', JSON.stringify(saved, null, 2));
} catch (err) {
    console.error('Force save failed:', err);
}
