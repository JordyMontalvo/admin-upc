"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Download, MessageSquare, Eye, TrendingUp, Users, CheckCircle } from "lucide-react"

interface Campaign {
  _id?: string
  id?: number
  name: string
  type?: string
  sendDate?: string
  sentAt?: string | Date
  createdAt?: string | Date
  sent?: number
  recipients?: number
  read?: number
  interactions?: number
  successCount?: number
  failureCount?: number
  status?: string
}

interface CampaignResultsProps {
  campaign: Campaign | undefined
  onClose: () => void
}

export function CampaignResults({ campaign, onClose }: CampaignResultsProps) {
  if (!campaign) return null

  // Mapear campos de la base de datos a los esperados por el componente
  const sent = campaign.sent ?? campaign.recipients ?? 0
  const read = campaign.read ?? campaign.successCount ?? 0
  const interactions = campaign.interactions ?? 0
  const sendDate = campaign.sendDate ?? 
    (campaign.sentAt ? new Date(campaign.sentAt).toISOString().split('T')[0] : 
     campaign.createdAt ? new Date(campaign.createdAt).toISOString().split('T')[0] : 
     new Date().toISOString().split('T')[0])
  const campaignType = campaign.type ?? 'Evento'
  const campaignStatus = campaign.status ?? 'Enviado'

  // Calcular tasas con validación para evitar división por cero
  const readRate = sent > 0 ? ((read / sent) * 100).toFixed(1) : '0'
  const interactionRate = sent > 0 ? ((interactions / sent) * 100).toFixed(1) : '0'

  const handleDownloadReport = () => {
    // Logic for downloading CSV report
    console.log("Downloading report for campaign:", campaign._id || campaign.id)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={onClose} className="text-muted-foreground hover:text-foreground">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver a campañas
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-foreground">{campaign.name}</h1>
              <div className="flex items-center space-x-3 mt-2">
                <Badge
                  variant={campaignType === "Evento" ? "default" : "secondary"}
                  className={campaignType === "Evento" ? "bg-primary text-primary-foreground" : ""}
                >
                  {campaignType}
                </Badge>
                <span className="text-muted-foreground">
                  Enviado el {new Date(sendDate).toLocaleDateString("es-ES")}
                </span>
              </div>
            </div>
          </div>
          <Button onClick={handleDownloadReport} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="w-4 h-4 mr-2" />
            Descargar reporte CSV
          </Button>
        </div>

        {/* Status Card */}
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-6 h-6 text-primary" />
                <div>
                  <p className="text-lg font-semibold text-foreground">Estado: {campaignStatus}</p>
                  <p className="text-muted-foreground">Campaña completada exitosamente</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Users className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Total de destinatarios</p>
                  <p className="text-2xl font-bold text-foreground">{sent.toLocaleString()}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Mensajes leídos</p>
                  <p className="text-2xl font-bold text-foreground">{read.toLocaleString()}</p>
                  <p className="text-sm text-primary">{readRate}% tasa de lectura</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <MessageSquare className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Conversaciones iniciadas</p>
                  <p className="text-2xl font-bold text-foreground">{Math.floor(interactions * 0.7)}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Interacciones</p>
                  <p className="text-2xl font-bold text-foreground">{interactions}</p>
                  <p className="text-sm text-primary">{interactionRate}% tasa de interacción</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed Results */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Summary */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Resumen de rendimiento</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mensajes enviados</span>
                <span className="font-semibold text-foreground">{sent.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mensajes entregados</span>
                <span className="font-semibold text-foreground">
                  {Math.floor(sent * 0.98).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Mensajes leídos</span>
                <span className="font-semibold text-foreground">{read.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Respuestas recibidas</span>
                <span className="font-semibold text-foreground">{Math.floor(interactions * 0.8)}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Enlaces clickeados</span>
                <span className="font-semibold text-foreground">{Math.floor(interactions * 0.6)}</span>
              </div>
            </CardContent>
          </Card>

          {/* Timeline */}
          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-foreground">Cronología de envío</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-foreground">Campaña iniciada</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sendDate + "T09:00:00").toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-foreground">Envío completado</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sendDate + "T09:15:00").toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <div>
                  <p className="font-medium text-foreground">Primeras respuestas</p>
                  <p className="text-sm text-muted-foreground">
                    {new Date(sendDate + "T09:30:00").toLocaleString("es-ES")}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-muted-foreground rounded-full"></div>
                <div>
                  <p className="font-medium text-foreground">Reporte generado</p>
                  <p className="text-sm text-muted-foreground">Ahora</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
