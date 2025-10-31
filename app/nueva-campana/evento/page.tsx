"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Send, TestTube, Calendar } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

const cmsEvents = [
  { id: "product-launch", name: "Lanzamiento de Producto", description: "Nuevo producto disponible en nuestra tienda" },
  { id: "promotion", name: "Promoción Especial", description: "Descuentos exclusivos por tiempo limitado" },
  { id: "webinar", name: "Recordatorio de Webinar", description: "No te pierdas nuestro próximo webinar" },
  { id: "newsletter", name: "Newsletter Semanal", description: "Resumen semanal de noticias y actualizaciones" },
]

export default function EventCampaignPage() {
  const router = useRouter()
  const [selectedEvent, setSelectedEvent] = useState("")
  const [campaignName, setCampaignName] = useState("")
  const [customLink, setCustomLink] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [isSending, setIsSending] = useState(false)
  const [recipientCount, setRecipientCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(true)
  const [events, setEvents] = useState<any[]>([])
  const [loadingEvents, setLoadingEvents] = useState(true)
  const [isTestSending, setIsTestSending] = useState(false)

  const selectedEventData = events.find((event: any) => event.id === selectedEvent)

  // Fetch recipient count and events on component mount
  useEffect(() => {
    const fetchRecipientCount = async () => {
      try {
        const response = await fetch('/api/contacts/count')
        if (response.ok) {
          const data = await response.json()
          setRecipientCount(data.totalContacts || 0)
        }
      } catch (error) {
        console.error('Error fetching recipient count:', error)
      } finally {
        setLoadingCount(false)
      }
    }

    const fetchEvents = async () => {
      try {
        const response = await fetch('/api/events')
        if (response.ok) {
          const data = await response.json()
          setEvents(data.events || [])
        }
      } catch (error) {
        console.error('Error fetching events:', error)
        // Fallback to mock data if Contentful fails
        setEvents([
          { id: "mock-1", title: "Evento de prueba 1", date: "Fecha por confirmar", time: "Horario por confirmar" },
          { id: "mock-2", title: "Evento de prueba 2", date: "Fecha por confirmar", time: "Horario por confirmar" }
        ])
      } finally {
        setLoadingEvents(false)
      }
    }

    fetchRecipientCount()
    fetchEvents()
  }, [])

  const handleTestSend = async () => {
    setIsTestSending(true)
    console.log('[CLIENT] Iniciando envío de prueba')
    try {
      // Preparar datos de prueba con enlace
      let testParams = ['Noche UPC', '12 Octubre', '7pm']
      let testLink = customLink.trim() || 'https://ejemplo.com/evento-prueba'
      
      if (selectedEventData) {
        testParams = [
          selectedEventData.title || 'Noche UPC',
          selectedEventData.date || '12 Octubre',
          selectedEventData.time || '7pm'
        ]
        testLink = customLink.trim() || selectedEventData.link || selectedEventData.url || 'https://ejemplo.com/evento-prueba'
      }
      
      console.log('[CLIENT] Enviando prueba con:', { eventParams: testParams, linkUrl: testLink })
      
      const response = await fetch('/api/send-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          to: '51993800154', // Número de prueba
          eventParams: testParams,
          linkUrl: testLink
        }),
      })

      console.log('[CLIENT] Respuesta del fetch:', response.status, response.statusText)

      const result = await response.json()
      console.log('[CLIENT] Resultado JSON:', result)

      if (result.success) {
        alert(`✅ Mensaje de prueba enviado exitosamente!\n\nEl mensaje incluye:\n- Evento: ${testParams[0]}\n- Fecha: ${testParams[1]}\n- Hora: ${testParams[2]}\n- Enlace: ${testLink}`)
        console.log('Resultado:', result.data)
      } else {
        alert('Error al enviar mensaje de prueba: ' + result.error)
        console.error('Error del servidor:', result.error)
      }
    } catch (error) {
      console.error('[CLIENT] Error en el fetch:', error)
      alert('Error al enviar mensaje de prueba: ' + (error instanceof Error ? error.message : String(error)))
    } finally {
      setIsTestSending(false)
    }
  }

  const handleSendCampaign = () => {
    setShowConfirmDialog(true)
  }

  const confirmSendCampaign = async () => {
    setIsSending(true)

    try {
      console.log('[CLIENT] Iniciando envío de campaña a todos los contactos registrados')

      // Preparar parámetros del evento seleccionado
      let eventParams = ['Noche UPC', '12 Octubre', '7pm'] // Valores por defecto
      let eventLink = null
      
      if (selectedEventData) {
        eventParams = [
          selectedEventData.title || 'Noche UPC',
          selectedEventData.date || '12 Octubre',
          selectedEventData.time || '7pm'
        ]
        // Prioridad: link personalizado > link del evento > null
        eventLink = customLink.trim() || selectedEventData.link || selectedEventData.url || null
      } else {
        // Si no hay evento seleccionado, usar el link personalizado
        eventLink = customLink.trim() || null
      }

      const response = await fetch('/api/send-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventParams,
          campaignName,
          linkUrl: eventLink,
          selectedEvent: selectedEventData ? {
            id: selectedEventData.id,
            title: selectedEventData.title,
            date: selectedEventData.date,
            time: selectedEventData.time,
            link: selectedEventData.link,
            url: selectedEventData.url
          } : null
        }),
      })

      console.log('[CLIENT] Respuesta del fetch:', response.status, response.statusText)

      const result = await response.json()
      console.log('[CLIENT] Resultado JSON:', result)

      if (result.success) {
        console.log('Campaña enviada:', result.summary)
        const recipientCount = result.summary.success
        router.push(`/campana-enviada?recipients=${recipientCount}&name=${encodeURIComponent(campaignName)}`)
      } else {
        alert('Error al enviar campaña: ' + result.error)
        console.error('Error del servidor:', result.error)
        setIsSending(false)
        setShowConfirmDialog(false)
      }
    } catch (error) {
      console.error('[CLIENT] Error en el fetch:', error)
      alert('Error al enviar campaña: ' + (error instanceof Error ? error.message : String(error)))
      setIsSending(false)
      setShowConfirmDialog(false)
    }
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/nueva-campana">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Promocionar Evento</h1>
            <p className="text-muted-foreground mt-1">Selecciona un evento del CMS para promocionar</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Name */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Información de la Campaña
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="campaign-name">Nombre de la campaña</Label>
                  <Input
                    id="campaign-name"
                    placeholder="Ej: Promoción Black Friday 2024"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Event Selection */}
            <Card>
              <CardHeader>
                <CardTitle>Seleccionar Evento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="event-select">Evento del CMS</Label>
                  <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un evento del CMS" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingEvents ? (
                        <SelectItem value="loading" disabled>
                          Cargando eventos...
                        </SelectItem>
                      ) : events.length > 0 ? (
                        events.map((event: any) => (
                          <SelectItem key={event.id} value={event.id}>
                            {event.title}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="no-events" disabled>
                          No hay eventos disponibles
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEventData && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">{selectedEventData.title}</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><strong>Fecha:</strong> {selectedEventData.date}</p>
                      <p><strong>Hora:</strong> {selectedEventData.time}</p>
                      {selectedEventData.link && (
                        <p><strong>Enlace:</strong> <a href={selectedEventData.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">{selectedEventData.link}</a></p>
                      )}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Link Personalizado */}
            <Card>
              <CardHeader>
                <CardTitle>Enlace del Evento (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="custom-link">URL del evento</Label>
                  <Input
                    id="custom-link"
                    type="url"
                    placeholder="https://ejemplo.com/evento"
                    value={customLink}
                    onChange={(e) => setCustomLink(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Si el evento tiene un enlace, se agregará como botón en el mensaje. Si no especificas uno y el evento del CMS tiene un enlace, se usará ese.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Destinatarios</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-lg">
                  <p className="text-sm text-foreground font-medium">
                    Usuarios registrados que han aceptado términos y condiciones
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    La campaña se enviará únicamente a usuarios que han dado su consentimiento explícito
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Acciones</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full bg-transparent cursor-pointer"
                  onClick={handleTestSend}
                  disabled={!campaignName || !selectedEvent || isTestSending}
                >
                  {isTestSending ? (
                    <div className="flex items-center space-x-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                      <span>Enviando...</span>
                    </div>
                  ) : (
                    <>
                      <TestTube className="w-4 h-4 mr-2" />
                      Enviar prueba
                    </>
                  )}
                </Button>
                <Button className="w-full cursor-pointer" onClick={handleSendCampaign} disabled={!campaignName || !selectedEvent}>
                  <Send className="w-4 h-4 mr-2" />
                  Enviar campaña
                </Button>
              </CardContent>
            </Card>

            {/* Campaign Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Destinatarios:</span>
                  <span className="font-medium">
                    {loadingCount ? 'Cargando...' : `${recipientCount} ${recipientCount === 1 ? 'usuario' : 'usuarios'}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo estimado:</span>
                  <span className="font-medium">$0.05 por mensaje</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar envío de campaña</DialogTitle>
            <DialogDescription>
              {isSending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
                  <span>Enviando campaña a todos los contactos...</span>
                </div>
              ) : (
                `¿Estás seguro de que deseas enviar la campaña "${campaignName}" a ${recipientCount} ${recipientCount === 1 ? 'contacto registrado' : 'contactos registrados'}? Esta acción no se puede deshacer.`
              )}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isSending}
            >
              Cancelar
            </Button>
            <Button
              onClick={confirmSendCampaign}
              disabled={isSending}
            >
              {isSending ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Enviando...</span>
                </div>
              ) : (
                'Confirmar envío'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
