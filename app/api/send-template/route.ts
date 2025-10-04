import { NextRequest, NextResponse } from 'next/server'
import axios from 'axios'

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
          'Authorization': `Bearer EAATOh6iDpxgBPqZAmZC4Vn5rt3SYPgZBY1suzFAfZCpvJOY0a7Rxm1NaqnOHwi1We8Y0e27wnA2cL9S128dbtip6Bt6LinTZClujzyNKzFsggSZADWBrOVXRNZBZBocZCjJhrQLxAiVzZB8tfDPxrWcOiMCnYsdDzFqZAjeEviQQf6qRR97eygomljd8JJZB5IwdoiyamIakFfHvUK8KLeGk5MR2ZCObHSZCwZAyGfcMD2JzmoQBcuokKZBEqpT00DUy91A8afkZD`,
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
    const body = await request.json()
    console.log('[API] Body recibido:', body)

    const { to } = body
    const phoneNumberId = '847905635065421'
    const templateName = 'recordatorio'
    const languageCode = 'en_US'
    const parameters: string[] = ['2025-12-31', '10:00 AM']

    console.log(`[API] Enviando a: ${to || '51993800154'}, Template: ${templateName}, Language: ${languageCode}, Params: ${parameters.join(', ')}`)

    const result = await sendTemplateMessage(phoneNumberId, to || '51993800154', templateName, languageCode, parameters)

    console.log('[API] Respuesta exitosa:', result)
    return NextResponse.json({ success: true, data: result })
  } catch (error: any) {
    console.error('[API] Error en la API:', error.message)
    console.error('[API] Stack:', error.stack)
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}