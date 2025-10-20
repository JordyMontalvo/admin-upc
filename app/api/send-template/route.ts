import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { connectToDatabase } from '@/lib/db/connection'
import { getAllContacts, getAllContactsDebug } from '@/lib/db/contacts'
import { saveCampaign } from '@/lib/db/campaigns'
import dotenv from 'dotenv'

dotenv.config()

const sendTemplateMessage = async (phoneNumberId: string, to: string, templateName: string, languageCode: string, parameters?: string[]) => {
  console.log(`[WHATSAPP] Enviando mensaje de plantilla '${templateName}' a ${to}`)

  const template: any = {
    name: templateName,
    language: {
      code: languageCode
    }
  }

  if (parameters && parameters.length > 0) {
    template.components = [
      {
        type: 'body',
        parameters: parameters.map(param => ({ type: 'text', text: param }))
      }
    ]
  }

  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'template',
        template: template
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )

    console.log(`[WHATSAPP] ✅ Mensaje de plantilla enviado exitosamente a ${to}`)
    return response.data
  } catch (error: any) {
    console.error('❌ Error al enviar mensaje de plantilla:')
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    throw error
  }
}

export async function POST(request: NextRequest) {
  console.log('[API] Recibida solicitud POST a /api/send-template')

  try {
    const { eventParams, campaignName, selectedEvent, to } = await request.json()
    console.log('[API] Body recibido:', { eventParams, campaignName, selectedEvent, to })
    
    // Verificar si es una prueba (cuando se envía 'to')
    const isTest = !!to
    console.log('[API] Es prueba:', isTest)

    // Conectar a la base de datos solo si no es prueba
    if (!isTest) {
      await connectToDatabase()
      console.log('[API] Conectado a la base de datos')
    }

    let contacts = []
    if (isTest) {
      // Para pruebas, usar solo el número especificado
      contacts = [{ phoneNumber: to }]
      console.log(`[API] Modo prueba: enviando solo a ${to}`)
    } else {
      // Obtener todos los contactos para campaña real
      contacts = await getAllContacts()
      console.log(`[API] Encontrados ${contacts.length} contactos totales`)

      // Debug: obtener todos los contactos para ver qué hay
      const allContacts = await getAllContactsDebug()
      console.log(`[API] Total de contactos en DB (debug): ${allContacts.length}`)
      console.log('[API] Muestra de contactos:', allContacts.slice(0, 3).map((c: any) => ({
        phone: c.phoneNumber,
        registered: c.isRegistered,
        name: c.name
      })))

      console.log('[API] Todos los contactos encontrados:', contacts.map((c: any) => ({ phone: c.phoneNumber })))
    }

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '847905635065421'
    const templateName = 'recordatorio'
    const languageCode = 'en_US'
    const parameters: string[] = eventParams || ['Noche UPC', '12 Octubre', '7pm']

    let successCount = 0
    let failureCount = 0
    const results = []

    // Enviar a cada contacto registrado
    for (const contact of contacts) {
      try {
        console.log(`[API] Enviando a: ${contact.phoneNumber}`)
        const result = await sendTemplateMessage(phoneNumberId, contact.phoneNumber, templateName, languageCode, parameters)
        results.push({ phone: contact.phoneNumber, success: true, data: result })
        successCount++
      } catch (error: any) {
        console.error(`[API] Error enviando a ${contact.phoneNumber}:`, error.message)
        results.push({ phone: contact.phoneNumber, success: false, error: error.message })
        failureCount++
      }

      // Pequeña pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`[API] ${isTest ? 'Prueba' : 'Campaña'} completada: ${successCount} exitosos, ${failureCount} fallidos`)

    // Guardar la campaña en la base de datos solo si NO es una prueba
    if (!isTest) {
      try {
        const campaignData = {
          name: campaignName || 'Campaña sin nombre',
          event: selectedEvent,
          recipients: successCount,
          totalContacts: contacts.length,
          successCount,
          failureCount,
          template: 'recordatorio',
          parameters: parameters
        };

        await saveCampaign(campaignData);
        console.log('[API] Campaña guardada en base de datos');
      } catch (saveError) {
        console.error('[API] Error guardando campaña:', saveError);
        // No fallar la respuesta por error de guardado
      }
    } else {
      console.log('[API] Prueba completada - no se guardó en base de datos');
    }

    return NextResponse.json({
      success: true,
      summary: { total: contacts.length, success: successCount, failure: failureCount },
      results: results
    })
  } catch (error: any) {
    console.error('[API] Error en la API:', error.message)
    console.error('[API] Stack:', error.stack)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}