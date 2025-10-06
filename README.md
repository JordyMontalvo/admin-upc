# WhatsApp Campaigns Dashboard

Dashboard administrativo para gestionar campañas de WhatsApp Business API. Permite crear campañas basadas en eventos de Contentful y enviar mensajes masivos a contactos registrados.

## 🚀 Características

- **Dashboard de campañas** con estadísticas en tiempo real
- **Integración con Contentful** para obtener eventos
- **Envío masivo de WhatsApp** con plantillas personalizadas
- **Gestión de contactos** desde MongoDB Atlas
- **Interfaz moderna** con Next.js y Tailwind CSS
- **API REST** para integraciones externas

## 📋 Prerrequisitos

- Node.js 18+
- Cuenta de MongoDB Atlas
- Cuenta de Contentful
- Cuenta de WhatsApp Business API

## 🛠️ Instalación

1. **Clona el repositorio:**
   ```bash
   git clone <url-del-repositorio>
   cd whatsapp-campaigns
   ```

2. **Instala dependencias:**
   ```bash
   npm install
   ```

3. **Configura variables de entorno:**
   ```bash
   cp .env.example .env
   ```

   Edita el archivo `.env` con tus credenciales reales.

## ⚙️ Configuración

### Variables de Entorno

Crea un archivo `.env` con las siguientes variables:

```env
# Base de datos MongoDB
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority
DB_NAME=cultural-bot

# Contentful CMS
CONTENTFUL_SPACE_ID=tu_space_id_aqui
CONTENTFUL_ACCESS_TOKEN=tu_access_token_aqui
CONTENTFUL_ENVIRONMENT=master

# WhatsApp Business API
WHATSAPP_TOKEN=tu_whatsapp_token_aqui
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id_aqui
```

### Configuración de WhatsApp Business API

1. Crea una cuenta en [WhatsApp Business API](https://developers.facebook.com/docs/whatsapp/)
2. Obtén tu `WHATSAPP_TOKEN` y `WHATSAPP_PHONE_NUMBER_ID`
3. Configura el webhook en tu panel de WhatsApp

### Configuración de Contentful

1. Crea un espacio en [Contentful](https://www.contentful.com/)
2. Obtén tu `CONTENTFUL_SPACE_ID` y `CONTENTFUL_ACCESS_TOKEN`
3. Crea un content type llamado "event" con los campos necesarios

### Configuración de MongoDB

1. Crea un cluster en [MongoDB Atlas](https://www.mongodb.com/atlas)
2. Obtén tu `MONGODB_URI`
3. Configura la base de datos con las colecciones necesarias

## 🚀 Despliegue en Vercel

### Opción 1: Despliegue automático

1. **Conecta tu repositorio a Vercel:**
   - Ve a [vercel.com](https://vercel.com)
   - Importa tu proyecto desde GitHub/GitLab

2. **Configura variables de entorno:**
   - Ve a Settings > Environment Variables
   - Agrega todas las variables del `.env`

3. **Despliega:**
   - Vercel detectará automáticamente que es un proyecto Next.js
   - El despliegue se hará automáticamente

### Opción 2: CLI de Vercel

```bash
# Instala Vercel CLI
npm i -g vercel

# Despliega
vercel

# Configura variables de entorno
vercel env add MONGODB_URI
vercel env add DB_NAME
# ... agrega todas las variables
```

## 📱 Uso

### Dashboard Principal
- Visualiza estadísticas de campañas enviadas
- Lista de campañas previas con detalles

### Crear Nueva Campaña
1. Ve a `/nueva-campana`
2. Selecciona el tipo de campaña (Evento)
3. Elige un evento del CMS
4. Configura el nombre de la campaña
5. Envía prueba (opcional)
6. Confirma el envío masivo

### API Endpoints

#### GET `/api/events`
Obtiene los eventos recientes de Contentful.

#### GET `/api/contacts/count`
Obtiene el conteo total de contactos registrados.

#### POST `/api/send-template`
Envía una campaña de WhatsApp.

**Body:**
```json
{
  "eventParams": ["Nombre Evento", "Fecha", "Hora"],
  "campaignName": "Nombre de campaña",
  "selectedEvent": { ...datos del evento }
}
```

#### GET `/api/campaigns`
Obtiene todas las campañas guardadas.

## 🏗️ Arquitectura

```
whatsapp-campaigns/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── nueva-campana/     # Páginas de creación
│   └── page.tsx          # Dashboard principal
├── components/            # Componentes React
├── lib/                   # Utilidades
│   ├── db/               # Conexión a BD
│   └── contentfulService.js
└── public/               # Archivos estáticos
```

## 🔧 Desarrollo

```bash
# Desarrollo local
npm run dev

# Build para producción
npm run build

# Linting
npm run lint
```

## 📊 Base de Datos

### Colecciones MongoDB

#### `contacts`
```javascript
{
  _id: ObjectId,
  phoneNumber: "51993800154",
  name: "Juan Pérez",
  isRegistered: true,
  createdAt: Date,
  lastMessage: Date
}
```

#### `campaigns`
```javascript
{
  _id: ObjectId,
  name: "Campaña Navidad 2024",
  event: { /* datos del evento */ },
  recipients: 2450,
  successCount: 2400,
  failureCount: 50,
  template: "recordatorio",
  parameters: ["Evento", "Fecha", "Hora"],
  createdAt: Date,
  sentAt: Date,
  status: "completed"
}
```

## 🚨 Solución de Problemas

### Error de conexión a MongoDB
- Verifica que `MONGODB_URI` sea correcta
- Asegúrate de que la IP esté en la whitelist de MongoDB Atlas

### Error en Contentful
- Verifica `CONTENTFUL_SPACE_ID` y `CONTENTFUL_ACCESS_TOKEN`
- Confirma que el content type "event" existe

### Error en WhatsApp API
- Verifica que `WHATSAPP_TOKEN` no haya expirado
- Confirma que `WHATSAPP_PHONE_NUMBER_ID` sea correcto

## 📄 Licencia

Este proyecto está bajo la Licencia MIT.

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request