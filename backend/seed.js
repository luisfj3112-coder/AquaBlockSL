const db = require('./db');
const bcrypt = require('bcryptjs');

const seed = async () => {
    try {
        const password = 'aquablocksl';
        const users = ['XavierM', 'LuisR', 'Victor', 'admin'];

        for (const username of users) {
            const pass = username === 'admin' ? 'admin123' : password;
            const hash = await bcrypt.hash(pass, 10);
            try {
                db.prepare('INSERT INTO users (username, password_hash) VALUES (?, ?)').run(username, hash);
                console.log(`User created: ${username}`);
            } catch (e) {
                console.log(`User ${username} already exists or error: ${e.message}`);
            }
        }

        // Create sample clients
        const clients = [
            { name: 'Lina Ruiz', address: 'Calle Mayor 10', city: 'Madrid', zip: '28001', phone: '612345678', email: 'lina.ruiz@gmail.com', offer_num: 'OF300925.01', offer_date: '2026-02-03', amount: 1500.50, stage: 'Sin presupuesto' },
            { name: 'Anne Gomez', address: 'Plaza del Sol 5', city: 'Catarroja', zip: '46470', phone: '623456789', email: 'anne@hotmail.com', offer_num: 'OF290925.03', offer_date: '2026-02-03', amount: 2450.00, stage: 'Presupuesto enviado' },
            { name: 'Luis García Pla', address: 'Miguel Hernández 18', city: 'Catarroja', zip: '46470', phone: '652996957', email: 'xilvia44@hotmail.es', offer_num: 'OF260925.01', offer_date: '2026-02-03', amount: 3200.00, stage: 'Vendido' }
        ];

        const stmt = db.prepare('INSERT INTO clients (name, address, city, zip, phone, email, offer_num, offer_date, amount, stage) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        for (const c of clients) {
            try {
                stmt.run(c.name, c.address, c.city, c.zip, c.phone, c.email, c.offer_num, c.offer_date, c.amount, c.stage);
            } catch (e) {
                // Ignore if client already exists
            }
        }
        console.log('Seed process completed');
    } catch (err) {
        console.log('Error during seeding:', err.message);
    }
};

seed();
