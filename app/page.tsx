"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, Users, TrendingUp, Mail, CheckCircle2, XCircle } from "lucide-react"
import { CampaignResults } from "@/components/campaign-results"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Mock data for campaigns (fallback)
const mockCampaigns = [
  {
    id: 1,
    name: "Lanzamiento Producto Q1",
    type: "Evento",
    sendDate: "2024-03-15",
    sent: 1250,
    read: 980,
    interactions: 156,
    status: "Enviado",
  },
  {
    id: 2,
    name: "Promoción Fin de Semana",
    type: "Custom",
    sendDate: "2024-03-10",
    sent: 850,
    read: 720,
    interactions: 89,
    status: "Enviado",
  },
  {
    id: 3,
    name: "Recordatorio Webinar",
    type: "Evento",
    sendDate: "2024-03-08",
    sent: 2100,
    read: 1890,
    interactions: 234,
    status: "Enviado",
  },
]

export default function CampaignsPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<any>(null)
  const [campaigns, setCampaigns] = useState<any[]>([])
  const [campaignStats, setCampaignStats] = useState<any>({ totalCampaigns: 0, totalMessages: 0 })
  const [loading, setLoading] = useState(true)
  const [sendingConfirmation, setSendingConfirmation] = useState(false)
  const [confirmationResult, setConfirmationResult] = useState<any>(null)
  const [showConfirmationDialog, setShowConfirmationDialog] = useState(false)

  const handleViewDetails = (campaignId: number) => {
    setSelectedCampaign(campaignId)
  }

  const handleCloseResults = () => {
    setSelectedCampaign(null)
  }

  // Load campaigns on component mount
  useEffect(() => {
    const loadCampaigns = async () => {
      try {
        const response = await fetch('/api/campaigns')
        if (response.ok) {
          const data = await response.json()
          setCampaigns(data.campaigns || [])
          setCampaignStats(data.stats || { totalCampaigns: 0, totalMessages: 0 })
        } else {
          // Fallback to mock data if API fails
          setCampaigns(mockCampaigns)
          setCampaignStats({ totalCampaigns: mockCampaigns.length, totalMessages: 4200 })
        }
      } catch (error) {
        console.error('Error loading campaigns:', error)
        // Fallback to mock data
        setCampaigns(mockCampaigns)
        setCampaignStats({ totalCampaigns: mockCampaigns.length, totalMessages: 4200 })
      } finally {
        setLoading(false)
      }
    }

    loadCampaigns()
  }, [])

  const handleSendConfirmation = async () => {
    setSendingConfirmation(true)
    setConfirmationResult(null)
    setShowConfirmationDialog(false)

    try {
      const response = await fetch('/api/send-confirmation', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()
      
      if (response.ok && data.success) {
        setConfirmationResult({
          success: true,
          summary: data.summary,
          message: `Confirmación enviada exitosamente a ${data.summary.success} usuarios.`
        })
      } else {
        setConfirmationResult({
          success: false,
          message: data.error || 'Error al enviar confirmación'
        })
      }
    } catch (error: any) {
      console.error('Error sending confirmation:', error)
      setConfirmationResult({
        success: false,
        message: error.message || 'Error al enviar confirmación'
      })
    } finally {
      setSendingConfirmation(false)
    }
  }

  if (selectedCampaign) {
    const campaign = campaigns.find((c: any) => c._id === selectedCampaign._id) || selectedCampaign
    return <CampaignResults campaign={campaign} onClose={handleCloseResults} />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Title */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Dashboard de Campañas</h1>
            <p className="text-muted-foreground mt-1">Resumen y gestión de campañas de difusión</p>
          </div>
          
          {/* Botón de confirmación de suscripción */}
          <AlertDialog open={showConfirmationDialog} onOpenChange={setShowConfirmationDialog}>
            <AlertDialogTrigger asChild>
              <Button 
                variant="outline" 
                className="flex items-center gap-2"
                disabled={sendingConfirmation}
              >
                <Mail className="w-4 h-4" />
                Enviar Confirmación de Suscripción
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Enviar mensaje de confirmación?</AlertDialogTitle>
                <AlertDialogDescription>
                  Se enviará un mensaje a todos los usuarios registrados preguntándoles si desean seguir recibiendo campañas y eventos.
                  <br /><br />
                  Los usuarios podrán confirmar que quieren seguir recibiendo mensajes o darse de baja.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={handleSendConfirmation} disabled={sendingConfirmation}>
                  {sendingConfirmation ? 'Enviando...' : 'Enviar Confirmación'}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>

        {/* Resultado de confirmación */}
        {confirmationResult && (
          <Card className={`bg-card border-border ${confirmationResult.success ? 'border-green-500' : 'border-red-500'}`}>
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                {confirmationResult.success ? (
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500" />
                )}
                <div className="flex-1">
                  <p className={`font-medium ${confirmationResult.success ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                    {confirmationResult.message}
                  </p>
                  {confirmationResult.summary && (
                    <div className="mt-2 text-sm text-muted-foreground">
                      <p>Total: {confirmationResult.summary.total} | 
                         Exitosos: {confirmationResult.summary.success} | 
                         Fallidos: {confirmationResult.summary.failure}</p>
                    </div>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setConfirmationResult(null)}
                >
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Enviados</p>
                  <p className="text-2xl font-bold text-foreground">{campaignStats.totalMessages?.toLocaleString() || '0'}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Mensajes Leídos</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Interacciones</p>
                  <p className="text-2xl font-bold text-foreground">0</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Tasa de Lectura</p>
                  <p className="text-2xl font-bold text-foreground">0%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Campaigns Table */}
        <Card className="bg-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Campañas Previas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Nombre de campaña</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Tipo</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Fecha de envío</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Enviados</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Leídos</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Interacciones</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        Cargando campañas...
                      </td>
                    </tr>
                  ) : campaigns.length > 0 ? (
                    campaigns.map((campaign: any) => (
                      <tr key={campaign._id} className="border-b border-border/50">
                        <td className="py-4 px-4">
                          <div className="font-medium text-foreground">{campaign.name}</div>
                        </td>
                        <td className="py-4 px-4">
                          <Badge
                            variant="default"
                            className="bg-primary text-primary-foreground"
                          >
                            Evento
                          </Badge>
                        </td>
                        <td className="py-4 px-4 text-muted-foreground">
                          {new Date(campaign.sentAt || campaign.createdAt).toLocaleDateString("es-ES")}
                        </td>
                        <td className="py-4 px-4 text-foreground font-medium">{campaign.recipients?.toLocaleString() || '0'}</td>
                        <td className="py-4 px-4 text-foreground font-medium">-</td>
                        <td className="py-4 px-4 text-foreground font-medium">-</td>
                        <td className="py-4 px-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewDetails(campaign)}
                            className="text-primary hover:text-primary hover:bg-primary/10"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver detalles
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={7} className="py-8 text-center text-muted-foreground">
                        No hay campañas enviadas aún
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
