const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

const clients = [
    { name: 'Sofia Mateu', address: 'Bisbe Aznar 73', city: 'La Rapita', zip: '43540', phone: '663677658', email: 'sofia.mateuarmela@gmail.com', offer_num: '', offer_date: '2025-12-21' },
    { name: 'ESTANC PAQUI', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0001', offer_date: '2026-12-24' },
    { name: 'MARE JUAN CARLOS', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0002', offer_date: '2026-12-24' },
    { name: 'MARE ROVIRA', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0003', offer_date: '2026-12-24' },
    { name: 'MARISIN', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2006.0004', offer_date: '2026-12-24' },
    { name: 'MONTSE MAIAN', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2006.0005', offer_date: '2026-12-24' },
    { name: 'NATI MATAMOROS', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2006.0006', offer_date: '2026-12-24' },
    { name: 'COMUNIDAD DE VECINOS', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0007', offer_date: '2026-12-24' },
    { name: 'RESTAURANT CASA ASMUNDO', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0008', offer_date: '2026-12-24' },
    { name: 'ELOI MATAMOROS', address: '', city: 'Godall', zip: '43516', phone: '679632143', email: '', offer_num: 'OF2026.0009', offer_date: '2026-02-03' },
    { name: 'NOELIA RALDA', address: '', city: 'Godall', zip: '43516', phone: '638266129', email: 'nralda@gmail.com', offer_num: 'OF2026.0010', offer_date: '2026-02-03' },
    { name: 'NOELIA RALDA (Pares)', address: '', city: 'Godall', zip: '43516', phone: '638266129', email: 'nralda@gmail.com', offer_num: 'OF2026.0011', offer_date: '2026-02-03' },
    { name: 'ARIADNA', address: '', city: 'Godall', zip: '43516', phone: '608168891', email: '', offer_num: 'OF2026.0012', offer_date: '2026-02-03' },
    { name: 'ARIADNA (Vecino)', address: '', city: 'Godall', zip: '43516', phone: '642906780', email: '', offer_num: 'OF2026.0013', offer_date: '2026-02-03' },
    { name: 'ALIN', address: '', city: 'Godall', zip: '43516', phone: '', email: '', offer_num: 'OF2026.0014', offer_date: '2026-02-03' },
    { name: 'JONATHAN', address: '', city: 'Godall', zip: '43516', phone: '638431266', email: '', offer_num: 'OF2026.0015', offer_date: '2026-02-03' },
    { name: 'GONZALO SANCHO (Regidor ayuntamiento)', address: '', city: 'Godall', zip: '43516', phone: '640637789', email: '', offer_num: 'OF2026.0016', offer_date: '2026-02-03' },
    { name: 'CENTRE DE DIA (AYUNTAMIENTO GODALL)', address: '', city: 'Godall', zip: '43516', phone: '640637789', email: '', offer_num: 'OF2026.0017', offer_date: '2026-02-03' },
    { name: 'ARNIN', address: '', city: 'Godall', zip: '43516', phone: '642574933', email: '', offer_num: 'OF2026.0018', offer_date: '2026-02-03' },
    { name: 'JOSEP M. SIMÓ', address: '', city: 'Godall', zip: '43516', phone: '666002352', email: '', offer_num: 'OF2026.0019', offer_date: '2026-02-03' }
];

try {
    const transaction = db.transaction(() => {
        // Clear all existing data
        db.prepare('DELETE FROM offer_items').run();
        db.prepare('DELETE FROM images').run();
        db.prepare('DELETE FROM clients').run();

        // Reset autoincrement
        db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('clients', 'images', 'offer_items')").run();

        const insertStmt = db.prepare(`
            INSERT INTO clients (name, address, city, zip, phone, email, offer_num, offer_date, stage, amount)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const client of clients) {
            insertStmt.run(
                client.name,
                client.address,
                client.city,
                client.zip,
                client.phone,
                client.email,
                client.offer_num,
                client.offer_date,
                'Sin presupuesto',
                0
            );
        }
    });

    transaction();
    console.log('Successfully cleared database and seeded new client data.');
} catch (err) {
    console.error('Error seeding data:', err);
}
