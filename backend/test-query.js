const db = require('./db');
try {
    const clients = db.prepare(`
        SELECT c.*, GROUP_CONCAT(i.filename) as images_list
        FROM clients c
        LEFT JOIN images i ON c.id = i.client_id
        GROUP BY c.id
    `).all();
    console.log(JSON.stringify(clients.filter(c => c.name.includes('Lina')), null, 2));
} catch (e) {
    console.error(e);
}
