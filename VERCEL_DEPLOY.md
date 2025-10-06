# 🚀 Despliegue en Vercel - Guía Completa

## Paso 1: Preparar el Repositorio

Asegúrate de que tu repositorio tenga estos archivos:
- ✅ `package.json` (ya existe)
- ✅ `.env.example` (creado)
- ✅ `README.md` (creado)
- ✅ `vercel.json` (creado)
- ✅ `.gitignore` (ya configurado)

## Paso 2: Conectar a Vercel

### Opción A: Desde Vercel Dashboard
1. Ve a [vercel.com](https://vercel.com) y haz login
2. Click en "New Project"
3. Importa tu repositorio de GitHub/GitLab
4. Vercel detectará automáticamente que es un proyecto Next.js

### Opción B: Desde Terminal
```bash
# Instalar Vercel CLI
npm i -g vercel

# Login
vercel login

# Desplegar
vercel

# Seguir las instrucciones en pantalla
```

## Paso 3: Configurar Variables de Entorno

### Desde Vercel Dashboard:
1. Ve a tu proyecto en Vercel
2. Click en "Settings" → "Environment Variables"
3. Agrega cada variable una por una:

| Variable | Valor | Environment |
|----------|-------|-------------|
| `MONGODB_URI` | `mongodb+srv://usuario:password@cluster.mongodb.net/database?retryWrites=true&w=majority` | Production |
| `DB_NAME` | `cultural-bot` | Production |
| `CONTENTFUL_SPACE_ID` | `tu_space_id_real` | Production |
| `CONTENTFUL_ACCESS_TOKEN` | `tu_access_token_real` | Production |
| `CONTENTFUL_ENVIRONMENT` | `master` | Production |
| `WHATSAPP_TOKEN` | `tu_whatsapp_token_real` | Production |
| `WHATSAPP_PHONE_NUMBER_ID` | `tu_phone_number_id_real` | Production |

### Desde Terminal:
```bash
# Agregar cada variable
vercel env add MONGODB_URI
vercel env add DB_NAME
vercel env add CONTENTFUL_SPACE_ID
vercel env add CONTENTFUL_ACCESS_TOKEN
vercel env add CONTENTFUL_ENVIRONMENT
vercel env add WHATSAPP_TOKEN
vercel env add WHATSAPP_PHONE_NUMBER_ID
```

## Paso 4: Verificar el Despliegue

1. **Build Status**: Debería ser exitoso
2. **URL del proyecto**: Algo como `https://whatsapp-campaigns.vercel.app`
3. **Funcionalidades a probar**:
   - ✅ Página principal carga
   - ✅ Dashboard muestra estadísticas
   - ✅ API routes responden (`/api/events`, `/api/contacts/count`)

## Paso 5: Configurar Dominio (Opcional)

Si quieres un dominio personalizado:
1. Ve a Settings → Domains
2. Agrega tu dominio
3. Configura DNS según las instrucciones

## 🔧 Solución de Problemas

### Error: "Build failed"
- Verifica que todas las dependencias estén en `package.json`
- Revisa los logs de build en Vercel

### Error: "Environment variable not found"
- Asegúrate de que las variables estén configuradas correctamente
- Reinicia el deployment después de agregar variables

### Error: "Database connection failed"
- Verifica que `MONGODB_URI` sea correcta
- Asegúrate de que la IP de Vercel esté en whitelist de MongoDB Atlas

### Error: "Contentful connection failed"
- Verifica `CONTENTFUL_SPACE_ID` y `CONTENTFUL_ACCESS_TOKEN`
- Confirma que el space existe y está activo

### Error: "WhatsApp API failed"
- Verifica que `WHATSAPP_TOKEN` no haya expirado
- Confirma que `WHATSAPP_PHONE_NUMBER_ID` sea correcto

## 📊 Monitoreo

Después del despliegue, puedes:
- Ver logs en tiempo real en Vercel Dashboard
- Configurar alertas para errores
- Monitorear rendimiento y uso

## 🎯 URLs Importantes

- **Aplicación**: `https://[tu-proyecto].vercel.app`
- **Dashboard**: `https://[tu-proyecto].vercel.app`
- **API Events**: `https://[tu-proyecto].vercel.app/api/events`
- **API Contacts**: `https://[tu-proyecto].vercel.app/api/contacts/count`

## ✅ Checklist Final

- [ ] Repositorio conectado a Vercel
- [ ] Todas las variables de entorno configuradas
- [ ] Build exitoso
- [ ] Aplicación carga correctamente
- [ ] APIs funcionan
- [ ] WhatsApp integration probada
- [ ] Contentful integration probada
- [ ] MongoDB connection probada

¡Tu aplicación está lista para producción! 🎉