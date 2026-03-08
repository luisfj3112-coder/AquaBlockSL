const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

try {
    const info = db.prepare("UPDATE clients SET stage = 'Presupuesto no enviado' WHERE stage = 'Sin presupuesto'").run();
    console.log(`Successfully updated ${info.changes} records from 'Sin presupuesto' to 'Presupuesto no enviado'.`);
} catch (err) {
    console.error('Error updating stages:', err);
}
