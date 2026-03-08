const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
    const insertClient = db.prepare(`
        INSERT INTO clients (name, stage, amount)
        VALUES (?, ?, ?)
    `);

    const info = insertClient.run('Test Persistencia', 'Sin presupuesto', 121);
    const clientId = info.lastInsertRowid;

    const insertItem = db.prepare(`
        INSERT INTO offer_items (client_id, description, price)
        VALUES (?, ?, ?)
    `);

    insertItem.run(clientId, 'Producto Test', 100);

    console.log(`Inserted test client with ID: ${clientId}`);
} catch (err) {
    console.error('Error inserting test data:', err);
}
