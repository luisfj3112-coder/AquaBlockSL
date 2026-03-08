const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const logPath = path.join(__dirname, 'debug.log');
if (fs.existsSync(logPath)) {
    console.log('--- debug.log found ---');
    console.log(fs.readFileSync(logPath, 'utf8'));
} else {
    console.log('--- debug.log NOT found ---');
}

const db = new Database(path.join(__dirname, 'database.sqlite'));
const items = db.prepare('SELECT * FROM offer_items').all();
console.log('--- Current Items ---');
console.log(JSON.stringify(items, null, 2));

const clients = db.prepare('SELECT id, name FROM clients ORDER BY id DESC LIMIT 5').all();
console.log('--- Recent Clients ---');
console.log(JSON.stringify(clients, null, 2));
