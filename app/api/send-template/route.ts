import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { connectToDatabase } from '@/lib/db/connection'
import { getAllContacts, getAllContactsDebug } from '@/lib/db/contacts'
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
          'Authorization': `Bearer EAATOh6iDpxgBPtBfFKqFhp1v1iMPYdOoG4Hd0uHxhQEvETX2LvpxpOnQwEDno5qbMJHS5CDx9K8OwZBj57ZAqcLixXcZAZCcQeB2TJfrKPG9gCEozZBBCaVCvMOKnwcbcuRtXpZCXVi7DEta74dw4lo3QBX0oXRS7Km4KpT1uMNjBR3clKjjf8WIddP9uZBBUf2lq6XISs6ZCF8Sa7CH`,
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
    // Conectar a la base de datos
    await connectToDatabase()
    console.log('[API] Conectado a la base de datos')

    // Obtener todos los contactos
    const contacts = await getAllContacts()
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

    const phoneNumberId = '847905635065421'
    const templateName = 'recordatorio'
    const languageCode = 'en_US'
    const parameters: string[] = ['Noche UPC', '12 Octubre', '7pm']

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

    console.log(`[API] Campaña completada: ${successCount} exitosos, ${failureCount} fallidos`)
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