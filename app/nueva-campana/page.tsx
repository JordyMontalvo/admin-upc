"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Calendar, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function CampaignTypePage() {
  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-4">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Volver
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-foreground">Nueva Campaña</h1>
            <p className="text-muted-foreground mt-1">Selecciona el tipo de campaña que deseas crear</p>
          </div>
        </div>

        {/* Campaign Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Link href="/nueva-campana/evento">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Promocionar Evento Existente</CardTitle>
                <CardDescription className="text-base">
                  Selecciona un evento del CMS y envía la información a tus usuarios registrados
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Eventos predefinidos del CMS
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Información automática del evento
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                    Configuración rápida
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/nueva-campana/personalizado">
            <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary/20">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <MessageSquare className="w-8 h-8 text-primary" />
                </div>
                <CardTitle className="text-xl">Mensaje Personalizado</CardTitle>
                <CardDescription className="text-base">
                  Crea un mensaje completamente personalizado con texto e imágenes
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Editor de texto enriquecido
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Soporte para imágenes
                  </div>
                  <div className="flex items-center">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                    Formateo compatible con WhatsApp
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Info Section */}
        <Card className="max-w-2xl mx-auto">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <p className="text-sm text-muted-foreground">
                <strong>Importante:</strong> Todas las campañas se envían únicamente a usuarios registrados que han
                aceptado los términos y condiciones.
              </p>
              <p className="text-xs text-muted-foreground">
                Actualmente tienes <strong>2,450 usuarios</strong> elegibles para recibir campañas.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
