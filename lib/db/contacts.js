const { getDb } = require('./connection');

// Obtener todos los contactos registrados
async function getAllContacts() {
  const db = getDb();
  return await db.collection('contacts')
    .find({}) // Todos los contactos
    .sort({ _id: -1 })
    .toArray();
}

// Obtener solo contactos activos (que NO se han dado de baja)
async function getActiveContacts() {
  const db = getDb();
  return await db.collection('contacts')
    .find({ 
      $or: [
        { optedOut: { $ne: true } },
        { optedOut: { $exists: false } }
      ]
    })
    .sort({ _id: -1 })
    .toArray();
}

// Obtener todos los contactos (para debugging)
async function getAllContactsDebug() {
  const db = getDb();
  return await db.collection('contacts')
    .find({})
    .sort({ _id: -1 })
    .limit(10)
    .toArray();
}

// Obtener estadísticas
async function getStats() {
  const db = getDb();
  const totalContacts = await db.collection('contacts').countDocuments({ isRegistered: true });
  const totalMessages = await db.collection('contacts').aggregate([
    { $match: { isRegistered: true } },
    { $group: { _id: null, total: { $sum: '$messageCount' } } }
  ]).toArray();

  return {
    totalContacts,
    totalMessages: totalMessages[0]?.total || 0
  };
}

module.exports = {
  getAllContacts,
  getAllContactsDebug,
  getStats,
  getActiveContacts
};