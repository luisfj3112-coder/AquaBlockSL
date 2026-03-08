const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'database.sqlite'));

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS clients (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    address TEXT,
    city TEXT,
    zip TEXT,
    phone TEXT,
    email TEXT,
    offer_num TEXT,
    offer_date TEXT,
    amount REAL,
    ordered INTEGER DEFAULT 0,
    man_num TEXT,
    order_date TEXT,
    stage TEXT DEFAULT 'Sin presupuesto'
  );

  CREATE TABLE IF NOT EXISTS images (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    filename TEXT NOT NULL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
  );

  CREATE TABLE IF NOT EXISTS offer_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    client_id INTEGER,
    description TEXT,
    price REAL,
    FOREIGN KEY (client_id) REFERENCES clients (id) ON DELETE CASCADE
  );
`);

module.exports = db;
