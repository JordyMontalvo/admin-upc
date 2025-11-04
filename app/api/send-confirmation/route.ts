import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'
import { connectToDatabase } from '@/lib/db/connection'
import { getAllContacts } from '@/lib/db/contacts'
import dotenv from 'dotenv'

dotenv.config()

// Función para enviar mensaje de texto
const sendTextMessage = async (phoneNumberId: string, to: string, text: string) => {
  try {
    const response = await axios.post(
      `https://graph.facebook.com/v23.0/${phoneNumberId}/messages`,
      {
        messaging_product: 'whatsapp',
        to: to,
        type: 'text',
        text: {
          body: text
        }
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
          'Content-Type': 'application/json'
        }
      }
    )
    console.log(`[WHATSAPP] ✅ Mensaje de confirmación enviado exitosamente a ${to}`)
    return response.data
  } catch (error: any) {
    console.error(`❌ Error al enviar mensaje de confirmación a ${to}:`)
    console.error('Status:', error.response?.status)
    console.error('Data:', error.response?.data)
    throw error
  }
}

export async function POST(request: NextRequest) {
  console.log('[API] Recibida solicitud POST a /api/send-confirmation')

  try {
    await connectToDatabase()
    console.log('[API] Conectado a la base de datos')

    // Obtener todos los contactos registrados (incluyendo los que se dieron de baja)
    const contacts = await getAllContacts()
    
    // Filtrar solo usuarios registrados
    const registeredContacts = contacts.filter((c: any) => c.isRegistered === true)
    console.log(`[API] Encontrados ${registeredContacts.length} contactos registrados`)

    const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID || '847905635065421'
    
    // Mensaje de confirmación
    const confirmationMessage = `📢 *Confirmación de suscripción*\n\nHola! 👋\n\nQueremos confirmar si deseas seguir recibiendo información sobre eventos culturales y campañas de la UPC.\n\nSi *no deseas* seguir recibiendo mensajes, escribe:\n❌ *darse de baja* o *baja*\n\nTu respuesta es importante para nosotros. 😊`

    let successCount = 0
    let failureCount = 0
    const results = []

    // Enviar a cada contacto registrado
    for (const contact of registeredContacts) {
      try {
        console.log(`[API] Enviando confirmación a: ${contact.phoneNumber}`)
        const result = await sendTextMessage(phoneNumberId, contact.phoneNumber, confirmationMessage)
        results.push({ phone: contact.phoneNumber, success: true, data: result })
        successCount++
      } catch (error: any) {
        console.error(`[API] Error enviando confirmación a ${contact.phoneNumber}:`, error.message)
        results.push({ phone: contact.phoneNumber, success: false, error: error.message })
        failureCount++
      }

      // Pequeña pausa para no sobrecargar la API
      await new Promise(resolve => setTimeout(resolve, 100))
    }

    console.log(`[API] Confirmación completada: ${successCount} exitosos, ${failureCount} fallidos`)

    return NextResponse.json({
      success: true,
      summary: { 
        total: registeredContacts.length, 
        success: successCount, 
        failure: failureCount 
      },
      results: results
    })
  } catch (error: any) {
    console.error('[API] Error en la API:', error.message)
    console.error('[API] Stack:', error.stack)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

