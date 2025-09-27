"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Eye, MessageSquare, Users, TrendingUp } from "lucide-react"
import { CampaignResults } from "@/components/campaign-results"

// Mock data for campaigns
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
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null)

  const handleViewDetails = (campaignId: number) => {
    setSelectedCampaign(campaignId)
  }

  const handleCloseResults = () => {
    setSelectedCampaign(null)
  }

  if (selectedCampaign) {
    const campaign = mockCampaigns.find((c) => c.id === selectedCampaign)
    return <CampaignResults campaign={campaign} onClose={handleCloseResults} />
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Dashboard Title */}
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard de Campañas</h1>
          <p className="text-muted-foreground mt-1">Resumen y gestión de campañas de difusión</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="bg-card border-border">
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-primary" />
                <div>
                  <p className="text-sm text-muted-foreground">Total Enviados</p>
                  <p className="text-2xl font-bold text-foreground">4,200</p>
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
                  <p className="text-2xl font-bold text-foreground">3,590</p>
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
                  <p className="text-2xl font-bold text-foreground">479</p>
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
                  <p className="text-2xl font-bold text-foreground">85.5%</p>
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
                  {mockCampaigns.map((campaign) => (
                    <tr key={campaign.id} className="border-b border-border/50">
                      <td className="py-4 px-4">
                        <div className="font-medium text-foreground">{campaign.name}</div>
                      </td>
                      <td className="py-4 px-4">
                        <Badge
                          variant={campaign.type === "Evento" ? "default" : "secondary"}
                          className={campaign.type === "Evento" ? "bg-primary text-primary-foreground" : ""}
                        >
                          {campaign.type}
                        </Badge>
                      </td>
                      <td className="py-4 px-4 text-muted-foreground">
                        {new Date(campaign.sendDate).toLocaleDateString("es-ES")}
                      </td>
                      <td className="py-4 px-4 text-foreground font-medium">{campaign.sent.toLocaleString()}</td>
                      <td className="py-4 px-4 text-foreground font-medium">{campaign.read.toLocaleString()}</td>
                      <td className="py-4 px-4 text-foreground font-medium">{campaign.interactions}</td>
                      <td className="py-4 px-4">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewDetails(campaign.id)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Eye className="w-4 h-4 mr-1" />
                          Ver detalles
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
