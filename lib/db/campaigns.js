const { getDb } = require('./connection');

// Guardar una nueva campaña
async function saveCampaign(campaignData) {
  const db = getDb();
  const now = new Date();

  const campaign = {
    ...campaignData,
    createdAt: now,
    sentAt: now,
    status: 'completed'
  };

  const result = await db.collection('campaigns').insertOne(campaign);
  console.log(`[MONGODB] Campaña guardada: ${campaign.name}`);

  return result.insertedId;
}

// Obtener todas las campañas
async function getAllCampaigns() {
  const db = getDb();
  return await db.collection('campaigns')
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
}

// Obtener estadísticas de campañas
async function getCampaignStats() {
  const db = getDb();
  const totalCampaigns = await db.collection('campaigns').countDocuments();
  const totalMessages = await db.collection('campaigns').aggregate([
    { $group: { _id: null, total: { $sum: '$recipients' } } }
  ]).toArray();

  return {
    totalCampaigns,
    totalMessages: totalMessages[0]?.total || 0
  };
}

module.exports = {
  saveCampaign,
  getAllCampaigns,
  getCampaignStats
};