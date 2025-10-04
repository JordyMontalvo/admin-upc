const { MongoClient } = require('mongodb');

let client = null;
let db = null;

async function connectToDatabase() {
  if (client && db) {
    return db;
  }

  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
  const dbName = process.env.DB_NAME || 'upc-cultural-bot';

  try {
    client = new MongoClient(uri);
    await client.connect();
    db = client.db(dbName);
    console.log('[MONGODB] Conectado a la base de datos');
    return db;
  } catch (error) {
    console.error('[MONGODB] Error conectando a la base de datos:', error);
    throw error;
  }
}

function getDb() {
  if (!db) {
    throw new Error('Base de datos no conectada. Llama a connectToDatabase() primero.');
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb
};