"use client"

import { useState } from "react"
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
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  const selectedEventData = cmsEvents.find((event) => event.id === selectedEvent)

  const handleTestSend = async () => {
    console.log('[CLIENT] Iniciando envío de prueba')
    try {
      console.log('[CLIENT] Enviando fetch a /api/send-template')
      const response = await fetch('/api/send-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: '51993800154' }), // Número de prueba
      })

      console.log('[CLIENT] Respuesta del fetch:', response.status, response.statusText)

      const result = await response.json()
      console.log('[CLIENT] Resultado JSON:', result)

      if (result.success) {
        alert('Mensaje de prueba enviado exitosamente')
        console.log('Resultado:', result.data)
      } else {
        alert('Error al enviar mensaje de prueba: ' + result.error)
        console.error('Error del servidor:', result.error)
      }
    } catch (error) {
      console.error('[CLIENT] Error en el fetch:', error)
      alert('Error al enviar mensaje de prueba: ' + (error instanceof Error ? error.message : String(error)))
    }
  }

  const handleSendCampaign = () => {
    setShowConfirmDialog(true)
  }

  const confirmSendCampaign = async () => {
    setShowConfirmDialog(false)

    try {
      console.log('[CLIENT] Iniciando envío de campaña')
      const response = await fetch('/api/send-template', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ to: '51993800154' }), // Por ahora envía a un número de prueba
      })

      console.log('[CLIENT] Respuesta del fetch:', response.status, response.statusText)

      const result = await response.json()
      console.log('[CLIENT] Resultado JSON:', result)

      if (result.success) {
        console.log('Resultado:', result.data)
        const recipientCount = 2450
        router.push(`/campana-enviada?recipients=${recipientCount}&name=${encodeURIComponent(campaignName)}`)
      } else {
        alert('Error al enviar campaña: ' + result.error)
        console.error('Error del servidor:', result.error)
      }
    } catch (error) {
      console.error('[CLIENT] Error en el fetch:', error)
      alert('Error al enviar campaña: ' + (error instanceof Error ? error.message : String(error)))
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
                      {cmsEvents.map((event) => (
                        <SelectItem key={event.id} value={event.id}>
                          {event.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEventData && (
                  <div className="bg-muted p-4 rounded-lg">
                    <h4 className="font-medium text-foreground mb-2">{selectedEventData.name}</h4>
                    <p className="text-sm text-muted-foreground">{selectedEventData.description}</p>
                  </div>
                )}
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
                  className="w-full bg-transparent"
                  onClick={handleTestSend}
                  disabled={!campaignName || !selectedEvent}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Enviar prueba
                </Button>
                <Button className="w-full" onClick={handleSendCampaign} disabled={!campaignName || !selectedEvent}>
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
                  <span className="font-medium">2,450 usuarios</span>
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
              ¿Estás seguro de que deseas enviar la campaña "{campaignName}" a 2,450 usuarios registrados? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={confirmSendCampaign}>Confirmar envío</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
