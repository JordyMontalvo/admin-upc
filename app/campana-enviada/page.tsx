"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, Home } from "lucide-react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { Suspense } from "react"

function CampaignSuccessContent() {
  const searchParams = useSearchParams()
  const recipients = searchParams.get("recipients") || "0"
  const campaignName = searchParams.get("name") || "Campaña"

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-foreground">¡Campaña enviada!</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className="space-y-2">
            <p className="text-muted-foreground">
              La campaña <span className="font-medium text-foreground">"{decodeURIComponent(campaignName)}"</span> ha
              sido enviada exitosamente.
            </p>
            <div className="bg-muted p-4 rounded-lg">
              <p className="text-2xl font-bold text-foreground">{recipients}</p>
              <p className="text-sm text-muted-foreground">números contactados</p>
            </div>
          </div>
          <div className="pt-4">
            <Link href="/">
              <Button className="w-full">
                <Home className="w-4 h-4 mr-2" />
                Volver al inicio
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function CampaignSuccessPage() {
  return (
    <Suspense fallback={<div>Cargando...</div>}>
      <CampaignSuccessContent />
    </Suspense>
  )
}
