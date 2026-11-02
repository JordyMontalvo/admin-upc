# Admin UPC Cultural — Dashboard de campañas de WhatsApp

Dashboard administrativo (Next.js 14, App Router) para crear y enviar campañas de WhatsApp Business de UPC Cultural. Toma los eventos de Contentful, envía una plantilla de WhatsApp a los contactos guardados en MongoDB y registra cada campaña.

Esta guía tiene tres partes según el público:

- [Operadores](#1-operadores-uso-del-dashboard) — cómo usar el dashboard.
- [Desarrolladores](#2-desarrolladores) — instalación, estructura, API y datos.
- [DevOps](#3-devops) — variables de entorno, despliegue y solución de problemas.

---

## 1. Operadores (uso del dashboard)

### Páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Dashboard: estadísticas (campañas y mensajes enviados, contactos) y lista de campañas previas. |
| `/nueva-campana` | Selector del tipo de campaña. Hoy solo está disponible **Evento**. |
| `/nueva-campana/evento` | Crear una campaña a partir de un evento de Contentful. |
| `/campana-enviada?recipients=<n>&name=<nombre>` | Pantalla de confirmación tras el envío. |
| `/nueva-campana/personalizado` | Campaña personalizada. **No disponible**: la opción está comentada en `app/nueva-campana/page.tsx`. La página existe, pero no debe usarse. |

### Crear y enviar una campaña de evento

1. Entra a `/nueva-campana` y elige **Evento**.
2. Selecciona un evento de la lista (viene de Contentful; ver [qué eventos aparecen](#qué-eventos-aparecen)).
3. Escribe el nombre de la campaña.
4. (Opcional) Pulsa **Enviar prueba**. Envía el mensaje solo a un número de prueba fijado en el código (`app/nueva-campana/evento/page.tsx`). **La prueba no se guarda como campaña.**
5. Confirma el envío masivo. Al terminar, verás la pantalla `/campana-enviada` y la campaña aparecerá en el dashboard.

### Qué recibe cada contacto

Cada contacto recibe **dos mensajes** de WhatsApp:

1. La plantilla `recordatorio` con tres datos: título del evento, fecha y hora.
2. Medio segundo después, un mensaje de texto: `🔗 Más información: <enlace>`.

Si el segundo mensaje falla, el primero ya se envió y el contacto cuenta como exitoso.

### Quién recibe la campaña

- Una campaña real se envía a todos los contactos que **no se han dado de baja** (sin `optedOut: true`).
- Cada contacto se procesa uno por uno, con una pausa de 100 ms. Una campaña grande puede tardar varios minutos.
- El resultado queda guardado con el número de envíos exitosos y fallidos.

### Baja de contactos y mensaje de confirmación

Un contacto se da de baja escribiendo `baja` o `darse de baja`. Quien marca el contacto como `optedOut` es el bot de WhatsApp, que **no está en este repositorio** (por confirmar).

El endpoint `POST /api/send-confirmation` envía un mensaje que pregunta si el contacto quiere seguir recibiendo información. Se envía a **todos los contactos con `isRegistered === true`, incluidos los que ya se dieron de baja**. Úsalo con cuidado.

### Qué eventos aparecen

El dashboard muestra eventos del content type `event` de Contentful (hasta 100):

- Sin fecha de inicio: no aparece.
- Con fecha de fin: aparece hasta el día de fin (inclusive).
- Sin fecha de fin: aparece solo hasta el día de inicio (inclusive).
- Las fechas se comparan por día en UTC, no en hora de Lima.

---

## 2. Desarrolladores

### Requisitos

- Node.js 18+
- Gestor de paquetes **pnpm** (el repo tiene `node_modules/.pnpm`; no se verificó el lockfile). `vercel.json` ejecuta `npm run build`.
- Acceso a MongoDB, Contentful y WhatsApp Business Cloud API (ver [variables](#variables-de-entorno)).

### Puesta en marcha

```bash
git clone <url-del-repositorio>
cd admin-upc
pnpm install

# Crea .env en la raíz con las variables de la sección DevOps
pnpm dev        # http://localhost:3000
```

No existe `.env.example`: el `.gitignore` excluye `.env*`, así que no se puede versionar. Usa el ejemplo de la sección [Variables de entorno](#variables-de-entorno).

### Scripts

| Comando | Qué hace |
|---------|----------|
| `pnpm dev` | Servidor de desarrollo. |
| `pnpm build` | Build de producción. |
| `pnpm start` | Sirve el build. |
| `pnpm lint` | `next lint`. |

No hay script de tests. El paquete se llama `my-v0-project` (viene de v0).

### Estructura

```
├── app/
│   ├── page.tsx                      # Dashboard
│   ├── layout.tsx
│   ├── nueva-campana/
│   │   ├── page.tsx                  # Selector de tipo
│   │   ├── evento/page.tsx           # Campaña de evento
│   │   └── personalizado/page.tsx    # Oculta
│   ├── campana-enviada/              # Confirmación
│   └── api/
│       ├── campaigns/route.ts
│       ├── contacts/count/route.ts
│       ├── events/route.ts
│       ├── send-template/route.ts
│       └── send-confirmation/route.ts
├── components/                       # Componentes React
├── hooks/                            # use-mobile, use-toast
└── lib/
    ├── contentfulService.js          # Lectura y filtrado de eventos
    ├── utils.ts
    └── db/
        ├── connection.js             # Conexión MongoDB
        ├── contacts.js
        └── campaigns.js
```

### Referencia de la API

Ninguna ruta tiene autenticación (ver [limitaciones](#limitaciones-conocidas)). Los errores devuelven HTTP 500.

#### `GET /api/events`

Eventos de Contentful ya filtrados.

```json
{
  "events": [
    {
      "id": "abc123",
      "title": "Noche UPC",
      "date": "sábado, 12 de octubre de 2024",
      "time": "19:00",
      "rawDate": "2024-10-12T00:00:00.000Z",
      "rawTime": "19:00",
      "link": "https://cultural.upc.edu.pe/agenda/noche-upc",
      "url": "https://cultural.upc.edu.pe/agenda/noche-upc"
    }
  ]
}
```

Error: `{ "error": "Failed to get events" }`. Si faltan `CONTENTFUL_SPACE_ID` o `CONTENTFUL_ACCESS_TOKEN`, devuelve `{ "events": [] }`.

#### `GET /api/contacts/count`

```json
{ "totalContacts": 2450, "totalMessages": 9800 }
```

`totalContacts` cuenta contactos con `isRegistered: true`. `totalMessages` es la suma de `messageCount` de esos contactos.

#### `GET /api/campaigns`

```json
{
  "campaigns": [ { "_id": "...", "name": "...", "recipients": 2400 } ],
  "stats": { "totalCampaigns": 12, "totalMessages": 28800 }
}
```

Ordenadas por `createdAt` descendente. Sin caché. `stats.totalMessages` es la suma de `recipients`.

#### `POST /api/send-template`

Envía la plantilla `recordatorio` (idioma `en_US`, 3 parámetros de cuerpo).

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `eventParams` | `string[]` | Parámetros de la plantilla: título, fecha, hora. Por defecto `["Noche UPC", "12 Octubre", "7pm"]`. |
| `campaignName` | `string` | Nombre guardado. Por defecto `"Campaña sin nombre"`. |
| `selectedEvent` | `object` | Evento completo. Se guarda en la campaña; de él se toma `link` o `url` si no hay `linkUrl`. |
| `linkUrl` | `string` | Enlace para el segundo mensaje. Tiene prioridad sobre el del evento. Sin enlace no se envía el segundo mensaje. |
| `to` | `string` | **Modo prueba**: si viene, envía solo a ese número y **no guarda** la campaña. |

Ejemplo (campaña real):

```json
{
  "eventParams": ["Noche UPC", "sábado, 12 de octubre", "19:00"],
  "campaignName": "Noche UPC - octubre",
  "selectedEvent": { "id": "abc123", "link": "https://cultural.upc.edu.pe/agenda/noche-upc" }
}
```

Respuesta:

```json
{
  "success": true,
  "summary": { "total": 2450, "success": 2400, "failure": 50 },
  "results": [
    { "phone": "51999999999", "success": true, "data": { } },
    { "phone": "51888888888", "success": false, "error": "Request failed with status code 401" }
  ]
}
```

Error: `{ "success": false, "error": "<mensaje>" }` con HTTP 500. Los fallos por contacto **no** hacen fallar la petición: se cuentan en `summary.failure`.

Comportamiento: envío secuencial contacto a contacto, pausa de 100 ms entre contactos, destinatarios = contactos activos (`getActiveContacts`). La campaña se guarda con `recipients = successCount`. Si falla el guardado, se registra el error en logs y la respuesta sigue siendo exitosa.

#### `POST /api/send-confirmation`

Sin cuerpo. Envía un mensaje de texto de confirmación de suscripción (pide escribir «baja» o «darse de baja» para dejar de recibir mensajes) a todos los contactos con `isRegistered === true`, **incluidos los dados de baja**. No guarda nada.

```json
{ "success": true, "summary": { "total": 2450, "success": 2400, "failure": 50 }, "results": [ ] }
```

### Base de datos (MongoDB)

Por defecto la base se llama `upc-cultural-bot` (`DB_NAME`).

#### `contacts`

La escribe principalmente el bot de WhatsApp; este repo solo la lee.

```javascript
{
  _id: ObjectId,
  phoneNumber: "51999999999",
  name: "Juan Pérez",
  isRegistered: true,
  optedOut: false,        // true = se dio de baja; puede no existir
  messageCount: 12,
  createdAt: Date,
  lastMessage: Date
}
```

Activo = `optedOut` inexistente o distinto de `true`.

#### `campaigns`

```javascript
{
  _id: ObjectId,
  name: "Noche UPC - octubre",
  event: { /* selectedEvent tal como llegó */ },
  recipients: 2400,       // = successCount
  totalContacts: 2450,    // contactos a los que se intentó enviar
  successCount: 2400,
  failureCount: 50,
  template: "recordatorio",
  parameters: ["Noche UPC", "sábado, 12 de octubre", "19:00"],
  createdAt: Date,
  sentAt: Date,           // igual a createdAt
  status: "completed"
}
```

### Lógica de eventos (`lib/contentfulService.js`)

- Lee el content type `event`, ordenado por `fields.date`, límite 100.
- **Fecha de inicio**: primer valor válido entre `date`, `eventDate`, `startDate`, `startDateTime`, `datetime`, `fecha`, `fechaHora`.
- **Fecha de fin**: primer valor válido entre `date_end`, `endDate`, `end_date`, `fechaFin`, `fecha_fin` y otras variantes (`finishDate`, `eventEndDate`, `toDate`, `dateTo`, `untilDate`…).
- **Hora**: se toma de campos como `time`, `startTime`, `hora`, `horario` o de la parte horaria de la fecha. Si la hora es `00:00` o falta, queda «Horario por confirmar».
- **Formato**: fecha y hora en `es-PE`, zona `America/Lima`.
- **URL**: si hay un slug (`slug`, `urlSlug`, `culturalSlug`, `permalink`) → `https://cultural.upc.edu.pe/agenda/<slug-normalizado>` (o `https://cultural.upc.edu.pe/<slug>` si empieza con `/`). Si no, un campo de enlace que apunte a `cultural.upc.edu.pe`. Si no, se deriva del título.
- Los nombres de campo exactos del content type en Contentful no se pudieron verificar: por confirmar.

### Limitaciones conocidas

- **Sin autenticación** en las rutas ni en las páginas: cualquiera con acceso a la URL puede lanzar envíos masivos.
- `/api/send-template` consulta `getActiveContacts` dos veces y además `getAllContactsDebug`, que limita a 10 contactos: el log «Total de contactos en DB» no es el total real.
- El número de prueba y el `WHATSAPP_PHONE_NUMBER_ID` por defecto están fijados en el código.
- La plantilla (`recordatorio`, `en_US`) y la versión de Graph API (`v23.0`) están fijadas en el código.
- No hay script de tests.

---

## 3. DevOps

### Variables de entorno

Se cargan con `dotenv` y con el entorno de Next.js. No se versiona ningún `.env` (el `.gitignore` excluye `.env*`).

| Variable | Obligatoria | Por defecto | Uso |
|----------|-------------|-------------|-----|
| `MONGODB_URI` | Sí en producción | `mongodb://localhost:27017` | Conexión a MongoDB. |
| `DB_NAME` | No | `upc-cultural-bot` | Nombre de la base. |
| `CONTENTFUL_SPACE_ID` | Sí | — | Space de Contentful. Sin él, `/api/events` devuelve lista vacía. |
| `CONTENTFUL_ACCESS_TOKEN` | Sí | — | Token de Content Delivery API. |
| `CONTENTFUL_ENVIRONMENT` | No | `master` | Entorno de Contentful. |
| `WHATSAPP_TOKEN` | Sí | — | Token de acceso de WhatsApp Cloud API (`Bearer`). |
| `WHATSAPP_PHONE_NUMBER_ID` | Recomendada | ID fijado en el código | Número de WhatsApp que envía. Configúralo siempre explícitamente. |

Ejemplo de `.env` (valores ficticios):

```env
MONGODB_URI=mongodb+srv://usuario:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=upc-cultural-bot

CONTENTFUL_SPACE_ID=tu_space_id
CONTENTFUL_ACCESS_TOKEN=tu_access_token
CONTENTFUL_ENVIRONMENT=master

WHATSAPP_TOKEN=tu_token_de_whatsapp
WHATSAPP_PHONE_NUMBER_ID=tu_phone_number_id
```

### Servicios externos

- **WhatsApp**: Cloud API de Meta (`https://graph.facebook.com/v23.0/<phone-number-id>/messages`). La plantilla `recordatorio` (idioma `en_US`, 3 parámetros de cuerpo, sin botones) debe estar aprobada en Meta.
- **Contentful**: content type `event`.
- **MongoDB Atlas**: colecciones `contacts` y `campaigns`.

### Despliegue en Vercel

`vercel.json` define:

- `framework`: `nextjs`, `buildCommand`: `npm run build`, `outputDirectory`: `.next`.
- Región `iad1`.
- `maxDuration` de **30 s** para `app/api/**/*.ts`.

Pasos:

1. Importa el repositorio en [Vercel](https://vercel.com).
2. En *Settings → Environment Variables*, agrega las variables de la tabla anterior.
3. Despliega. También sirve la CLI: `vercel` y `vercel env add <NOMBRE>`.

> ⚠️ Como el envío es secuencial (≥ 100 ms por contacto, más el tiempo de la API), con el límite de 30 s una campaña con muchos contactos puede cortarse a mitad. Si pasa, la campaña no se guarda aunque algunos mensajes ya hayan salido. Valida el volumen o ajusta `maxDuration` según tu plan de Vercel.

### Solución de problemas

| Síntoma | Qué revisar |
|---------|-------------|
| Error de conexión a MongoDB | `MONGODB_URI` correcta; la IP (o `0.0.0.0/0` en Vercel) permitida en Atlas → Network Access. Sin `MONGODB_URI`, se usa `localhost` y fallará en producción. |
| La lista de eventos está vacía | Variables de Contentful definidas; el content type se llama `event`; el evento tiene fecha de inicio y no ha terminado (ver [filtro](#qué-eventos-aparecen)). Revisa los logs `[FILTRO]`. |
| Todos los envíos fallan (401/190) | `WHATSAPP_TOKEN` caducado o inválido. |
| Fallan envíos con error de plantilla | La plantilla `recordatorio` (`en_US`) no existe o no está aprobada; la cantidad de parámetros debe ser 3. |
| Fallan envíos con error de número | `WHATSAPP_PHONE_NUMBER_ID` incorrecto. |
| La campaña no aparece en el dashboard | El envío se cortó por tiempo o falló el guardado (logs `[API] Error guardando campaña`). Las pruebas (`to`) nunca se guardan. |

Los logs del servidor usan prefijos `[API]`, `[WHATSAPP]`, `[MONGODB]` y `[FILTRO]`.
