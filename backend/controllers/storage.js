const fs = require('fs');
const path = require('path');

const databasePath = path.join(__dirname, '..', 'data', 'database.json');

function readDatabase() {
  try {
    return JSON.parse(fs.readFileSync(databasePath, 'utf8'));
  } catch (error) {
    throw new Error(`Não foi possível ler o banco local: ${error.message}`);
  }
}

function writeDatabase(data) {
  fs.writeFileSync(databasePath, JSON.stringify(data, null, 2), 'utf8');
}

function nextId(items) {
  return items.length ? Math.max(...items.map((item) => item.id)) + 1 : 1;
}

module.exports = { readDatabase, writeDatabase, nextId };
