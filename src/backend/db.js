const fs = require('node:fs');
const path = require('node:path');
const Database = require('better-sqlite3');

const schemaPath = path.resolve(__dirname, '../datastore/schema.sql');

function createDatabase(databasePath = ':memory:') {
  if (databasePath !== ':memory:') {
    fs.mkdirSync(path.dirname(databasePath), { recursive: true });
  }

  const database = new Database(databasePath);
  database.pragma('foreign_keys = ON');
  database.pragma('journal_mode = WAL');
  database.exec(fs.readFileSync(schemaPath, 'utf8'));
  return database;
}

module.exports = { createDatabase };
