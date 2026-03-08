const Database = require('better-sqlite3');
const path = require('path');
const db = new Database(path.join(__dirname, 'database.sqlite'));

const clientsSinPresupuesto = [
    { name: 'Sofia Mateu', address: 'Bisbe Aznar 73', city: 'La Rapita', zip: '43540', phone: '663677658', email: 'sofia.mateuarmela@gmail.com', offer_num: '', offer_date: '2025-12-21', stage: 'Sin presupuesto', amount: 0 },
    { name: 'ESTANC PAQUI', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0001', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'MARE JUAN CARLOS', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0002', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'MARE ROVIRA', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0003', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'MARISIN', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2006.0004', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'MONTSE MAIAN', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2006.0005', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'NATI MATAMOROS', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2006.0006', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'COMUNIDAD DE VECINOS', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0007', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'RESTAURANT CASA ASMUNDO', address: '', city: 'La Rapita', zip: '43540', phone: '', email: '', offer_num: 'OF2026.0008', offer_date: '2026-12-24', stage: 'Sin presupuesto', amount: 0 },
    { name: 'ELOI MATAMOROS', address: '', city: 'Godall', zip: '43516', phone: '679632143', email: '', offer_num: 'OF2026.0009', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'NOELIA RALDA', address: '', city: 'Godall', zip: '43516', phone: '638266129', email: 'nralda@gmail.com', offer_num: 'OF2026.0010', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'NOELIA RALDA (Pares)', address: '', city: 'Godall', zip: '43516', phone: '638266129', email: 'nralda@gmail.com', offer_num: 'OF2026.0011', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'ARIADNA', address: '', city: 'Godall', zip: '43516', phone: '608168891', email: '', offer_num: 'OF2026.0012', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'ARIADNA (Vecino)', address: '', city: 'Godall', zip: '43516', phone: '642906780', email: '', offer_num: 'OF2026.0013', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'ALIN', address: '', city: 'Godall', zip: '43516', phone: '', email: '', offer_num: 'OF2026.0014', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'JONATHAN', address: '', city: 'Godall', zip: '43516', phone: '638431266', email: '', offer_num: 'OF2026.0015', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'GONZALO SANCHO (Regidor ayuntamiento)', address: '', city: 'Godall', zip: '43516', phone: '640637789', email: '', offer_num: 'OF2026.0016', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'CENTRE DE DIA (AYUNTAMIENTO GODALL)', address: '', city: 'Godall', zip: '43516', phone: '640637789', email: '', offer_num: 'OF2026.0017', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'ARNIN', address: '', city: 'Godall', zip: '43516', phone: '642574933', email: '', offer_num: 'OF2026.0018', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 },
    { name: 'JOSEP M. SIMÓ', address: '', city: 'Godall', zip: '43516', phone: '666002352', email: '', offer_num: 'OF2026.0019', offer_date: '2026-02-03', stage: 'Sin presupuesto', amount: 0 }
];

const clientsPresupuestoEnviado = [
    { name: 'Enric Vidal Alsina', address: 'Ronda de Catalunya, 13', city: 'Cabrera de Mar', zip: '08349', phone: '610229593', email: 'enricvidalalsina@gmail.com', offer_num: 'OF220825.01', offer_date: '2025-08-22', amount: 467.50, stage: 'Presupuesto enviado' },
    { name: 'Luis García Pla', address: 'Miguel Hernández 18', city: 'Catarroja', zip: '46470', phone: '652996957', email: 'xilvia44@hotmail.es', offer_num: 'OF260925.01', offer_date: '2025-09-26', amount: 1485.00, stage: 'Presupuesto enviado', ordered: true, man_num: 'AQ260925.01', order_date: '2025-09-30' },
    { name: 'Paco', address: 'C/ Calvario 19. Bajo', city: 'Catarroja', zip: '46470', phone: '635558872', email: '', offer_num: 'OF290925.01', offer_date: '2025-09-29', amount: 3540.00, stage: 'Presupuesto enviado' },
    { name: 'Papeleria Carlin', address: 'Ramón y Cajal, 34', city: 'Catarroja', zip: '46470', phone: '618518135', email: 'carlincatarroja@yahoo.es', offer_num: 'OF290925.02', offer_date: '2025-09-29', amount: 2960.00, stage: 'Presupuesto enviado' },
    { name: 'Anne Gomez', address: '', city: 'Catarroja', zip: '46470', phone: '', email: 'annegoga2@hotmail.com', offer_num: 'OF290925.03', offer_date: '2025-09-29', amount: 7320.00, stage: 'Presupuesto enviado' },
    { name: 'Lina Ruiz', address: '', city: '', zip: '', phone: '', email: 'lina.ruiz.olmos@gmail.com', offer_num: 'OF300925.01', offer_date: '2025-09-30', amount: 2440.00, stage: 'Presupuesto enviado' },
    { name: 'Raquel Martínez Caparrós', address: 'C/ Alqueria 4', city: 'Catarroja', zip: '46470', phone: '645610413', email: 'rakelmarcapa@hotmail.com', offer_num: 'OF031025.01', offer_date: '2025-10-03', amount: 1406.00, stage: 'Presupuesto enviado', ordered: true, man_num: 'AQ031025.01', order_date: '2025-10-05' },
    { name: 'Carlos', address: 'C/ Reina 39', city: 'Catarroja', zip: '46470', phone: '623741804', email: 'zafra@gmx.com', offer_num: 'OF031025.02', offer_date: '2025-10-03', amount: 4694.00, stage: 'Presupuesto enviado' },
    { name: 'Armando', address: 'C/ Blasco Ibañez 127', city: 'Albal', zip: '46470', phone: '657891577', email: 'info@unicat.es', offer_num: 'OF051025.01', offer_date: '2025-10-05', amount: 8566.00, stage: 'Presupuesto enviado' },
    { name: 'Jesús', address: 'C/ Marqués del Turia 21', city: 'Benatúser', zip: '46950', phone: '622012337', email: '', offer_num: 'OF051025.02', offer_date: '2025-10-05', amount: 1721.00, stage: 'Presupuesto enviado' },
    { name: 'Manuel Maicas', address: 'C/ Marqués del Turia 19', city: 'Benatúser', zip: '46950', phone: '676949162', email: '', offer_num: 'OF051025.03', offer_date: '2025-10-05', amount: 3330.00, stage: 'Presupuesto enviado' },
    { name: 'Raúl Catarroja', address: 'C/ Esteve Paluzié 43', city: 'Catarroja', zip: '46470', phone: '637714151', email: 'rootsandsoul@hotmail.es', offer_num: 'OF051025.04', offer_date: '2025-10-05', amount: 0, stage: 'Presupuesto enviado' },
    { name: 'Gloria', address: 'C/ Galicia 62', city: 'Catarroja', zip: '46470', phone: '695691286', email: 'josemapocovi@gmail.com', offer_num: 'OF061025.01', offer_date: '2025-10-06', amount: 2824.00, stage: 'Presupuesto enviado' },
    { name: 'José Torres', address: 'C/ Maestro Palau 8', city: 'Paiporta', zip: '46200', phone: '678685977', email: 'info@rapidgoma.com', offer_num: 'OF061025.02', offer_date: '2025-10-06', amount: 13474.00, stage: 'Presupuesto enviado' },
    { name: 'Inmobiliaria ALBAL', address: 'Av. Padre Carlos Ferris 84', city: 'Albal', zip: '46470', phone: '602582266', email: 'albal2@expercasa.com', offer_num: 'OF061025.03', offer_date: '2025-10-06', amount: 8082.00, stage: 'Presupuesto enviado' },
    { name: 'Juanjo COMUNIDAD DE VECINOS', address: '', city: 'Paiporta', zip: '46200', phone: '608812510', email: '', offer_num: 'OF071025.01', offer_date: '2025-10-07', amount: 13035.00, stage: 'Presupuesto enviado' },
    { name: 'Silvia', address: 'C/ Esteve Paluzié 3', city: 'Catarroja', zip: '46470', phone: '633094197', email: 'silviabeldaboix@hotmail.com', offer_num: 'OF071025.02', offer_date: '2025-10-07', amount: 5395.00, stage: 'Presupuesto enviado' },
    { name: 'José Gil A', address: 'Massanassa 1', city: 'Catarroja', zip: '46470', phone: '667557948', email: 'j.gilpla@hotmail.com', offer_num: 'OF071025.03', offer_date: '2025-10-07', amount: 10136.00, stage: 'Presupuesto enviado' },
    { name: 'José Gil B', address: 'Massanassa 1', city: 'Catarroja', zip: '46470', phone: '667557948', email: 'j.gilpla@hotmail.com', offer_num: 'OF071025.04', offer_date: '2025-10-07', amount: 4980.00, stage: 'Presupuesto enviado' },
    { name: 'José Vicente Sanchís', address: 'Antonio Machado 6', city: 'Paiporta', zip: '46200', phone: '609267698', email: 'oficialjsanchis@gmail.com', offer_num: 'OF091025.01', offer_date: '2025-10-09', amount: 3290.69, stage: 'Presupuesto enviado', ordered: true },
    { name: 'Vicente Cortina', address: 'C/ Galicia, bajo', city: 'Catarroja', zip: '46470', phone: '630703147', email: '', offer_num: 'OF191025.01', offer_date: '2025-10-19', amount: 5300.00, stage: 'Presupuesto enviado' },
    { name: 'José Marco', address: 'C/ Galicia', city: 'Catarroja', zip: '46470', phone: '644119046', email: '', offer_num: 'OF191025.02', offer_date: '2025-10-19', amount: 3142.20, stage: 'Presupuesto enviado' },
    { name: 'Ruben', address: 'C/ Galicia', city: 'Catarroja', zip: '46470', phone: '', email: 'ruroch@hotmail.com', offer_num: 'OF191025.03', offer_date: '2025-10-19', amount: 2613.60, stage: 'Presupuesto enviado' },
    { name: 'Manuel Waliño A', address: 'C/ Sant Josep 51, bajo', city: 'Paiporta', zip: '46200', phone: '662149678', email: 'manuel.walino@gmail.com', offer_num: 'OF201025.01', offer_date: '2025-10-20', amount: 6969.60, stage: 'Presupuesto enviado' },
    { name: 'Manuel Waliño B', address: 'C/ Sant Josep 51, bajo', city: 'Paiporta', zip: '46200', phone: '662149678', email: 'manuel.walino@gmail.com', offer_num: 'OF201025.02', offer_date: '2025-10-20', amount: 3702.60, stage: 'Presupuesto enviado' },
    { name: 'Antonia y Jesús', address: 'C/ Constitució 18', city: 'Paiporta', zip: '46200', phone: '655607750', email: 'jesusjuanmurcia@gmail.com', offer_num: 'OF251025.01', offer_date: '2025-10-25', amount: 3017.62, stage: 'Presupuesto enviado' }
];

const allClients = [...clientsSinPresupuesto, ...clientsPresupuestoEnviado];

try {
    const transaction = db.transaction(() => {
        // Clear all existing data
        db.prepare('DELETE FROM offer_items').run();
        db.prepare('DELETE FROM images').run();
        db.prepare('DELETE FROM clients').run();

        // Reset autoincrement
        db.prepare("DELETE FROM sqlite_sequence WHERE name IN ('clients', 'images', 'offer_items')").run();

        const insertStmt = db.prepare(`
            INSERT INTO clients (name, address, city, zip, phone, email, offer_num, offer_date, stage, amount, ordered, man_num, order_date)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `);

        for (const client of allClients) {
            insertStmt.run(
                client.name,
                client.address || '',
                client.city || '',
                client.zip || '',
                client.phone || '',
                client.email || '',
                client.offer_num || '',
                client.offer_date || '',
                client.stage,
                client.amount || 0,
                client.ordered ? 1 : 0,
                client.man_num || '',
                client.order_date || ''
            );
        }
    });

    transaction();
    console.log(`Successfully cleared database and seeded ${allClients.length} new client records.`);
} catch (err) {
    console.error('Error seeding data:', err);
}
