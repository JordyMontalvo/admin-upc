const contentful = require('contentful');

// Verificar si tenemos credenciales de Contentful
const hasContentfulCredentials = process.env.CONTENTFUL_SPACE_ID && process.env.CONTENTFUL_ACCESS_TOKEN;

let client = null;

// Crear cliente de Contentful solo si tenemos credenciales
if (hasContentfulCredentials) {
  client = contentful.createClient({
    space: process.env.CONTENTFUL_SPACE_ID,
    environment: process.env.CONTENTFUL_ENVIRONMENT || 'master',
    accessToken: process.env.CONTENTFUL_ACCESS_TOKEN
  });
  console.log('✅ Usando Contentful con credenciales configuradas');
} else {
  console.log('⚠️  No se encontraron credenciales de Contentful. Usando datos de prueba.');
}

// Obtener los últimos 2 eventos
const getLatestEvents = async () => {
  if (!client) {
    console.log('⚠️  No hay cliente de Contentful configurado');
    return [];
  }

  try {
    const now = new Date().toISOString();

    // Obtener los 2 eventos más recientes (futuros o pasados)
    const events = await client.getEntries({
      content_type: 'event',
      order: '-fields.date', // Más recientes primero
      limit: 2
    });

    console.log(`✅ Se encontraron ${events.items.length} eventos recientes`);
    return events.items.map(formatEvent);

  } catch (error) {
    console.error('❌ Error al obtener eventos de Contentful:', error);
    return [];
  }
};

// Formatear un evento para la respuesta
const formatEvent = (item) => {
  const fields = item.fields || {};

  const title = fields.title || 'Evento sin título';
  const eventDate = fields.date ? new Date(fields.date) : null;

  return {
    id: item.sys?.id || '',
    title: title,
    date: eventDate ? eventDate.toLocaleDateString('es-PE', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      timeZone: 'America/Lima'
    }) : 'Fecha por confirmar',
    time: eventDate ? eventDate.toLocaleTimeString('es-PE', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'America/Lima'
    }) : 'Horario por confirmar',
    rawDate: eventDate ? eventDate.toISOString() : null,
    rawTime: eventDate ? eventDate.toTimeString() : null
  }
};


module.exports = {
  getLatestEvents
};