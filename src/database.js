import sqlite3 from 'sqlite3';
sqlite3.verbose();

const db = new sqlite3.Database('./myDatabase.db', err => {
    if (err) console.error('Error opening database: ' + err.message);
    else console.log('Connected to the SQLite database.');
});

let createQuery =
    'CREATE TABLE IF NOT EXISTS messages (ID INTEGER PRIMARY KEY AUTOINCREMENT, message TEXT, sentiment TEXT)';

db.run(createQuery, err => {
    if (err) console.error('Error creating table: ' + err.message);
    else console.log('Table created or exists.');
});

export default db;
