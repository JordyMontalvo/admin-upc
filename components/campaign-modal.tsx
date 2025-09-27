"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, Send, TestTube, FileText } from "lucide-react"

interface CampaignModalProps {
  isOpen: boolean
  onClose: () => void
}

const mockEvents = [
  { id: 1, short_title: "Webinar Marketing Digital" },
  { id: 2, short_title: "Lanzamiento Producto Q2" },
  { id: 3, short_title: "Conferencia Anual 2024" },
  { id: 4, short_title: "Workshop UX/UI" },
]

export function CampaignModal({ isOpen, onClose }: CampaignModalProps) {
  const [campaignType, setCampaignType] = useState<"event" | "custom" | "">("")
  const [selectedEvent, setSelectedEvent] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [sendToAll, setSendToAll] = useState(false)
  const [csvFile, setCsvFile] = useState<File | null>(null)
  const [testNumber, setTestNumber] = useState("")

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      setCsvFile(file)
    }
  }

  const handleSendTest = () => {
    // Logic for sending test message
    console.log("Sending test to:", testNumber)
  }

  const handleSendCampaign = () => {
    // Logic for sending campaign
    console.log("Sending campaign...")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-foreground">Nueva Campaña Push</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Campaign Type Selection */}
          <div className="space-y-3">
            <Label className="text-foreground">Tipo de campaña</Label>
            <div className="grid grid-cols-2 gap-3">
              <Card
                className={`cursor-pointer transition-colors ${
                  campaignType === "event" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCampaignType("event")}
              >
                <CardContent className="p-4 text-center">
                  <FileText className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-foreground">Usar evento del CMS</p>
                  <p className="text-sm text-muted-foreground">Seleccionar evento existente</p>
                </CardContent>
              </Card>

              <Card
                className={`cursor-pointer transition-colors ${
                  campaignType === "custom" ? "border-primary bg-primary/10" : "border-border hover:border-primary/50"
                }`}
                onClick={() => setCampaignType("custom")}
              >
                <CardContent className="p-4 text-center">
                  <Send className="w-6 h-6 mx-auto mb-2 text-primary" />
                  <p className="font-medium text-foreground">Mensaje personalizado</p>
                  <p className="text-sm text-muted-foreground">Crear mensaje desde cero</p>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Event Selection */}
          {campaignType === "event" && (
            <div className="space-y-2">
              <Label htmlFor="event-select" className="text-foreground">
                Seleccionar evento
              </Label>
              <Select value={selectedEvent} onValueChange={setSelectedEvent}>
                <SelectTrigger className="bg-input border-border text-foreground">
                  <SelectValue placeholder="Elige un evento activo" />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {mockEvents.map((event) => (
                    <SelectItem key={event.id} value={event.id.toString()}>
                      {event.short_title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Custom Message */}
          {campaignType === "custom" && (
            <div className="space-y-2">
              <Label htmlFor="custom-message" className="text-foreground">
                Mensaje personalizado
              </Label>
              <Textarea
                id="custom-message"
                placeholder="Hola {{1}}, tenemos una oferta especial para ti..."
                value={customMessage}
                onChange={(e) => setCustomMessage(e.target.value)}
                className="min-h-[100px] bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <p className="text-sm text-muted-foreground">
                Usa <code className="bg-muted px-1 rounded">{"{{1}}"}</code> como placeholder para el nombre del usuario
              </p>
            </div>
          )}

          {/* Recipients Section */}
          <div className="space-y-4">
            <Label className="text-foreground">Destinatarios</Label>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="send-all"
                checked={sendToAll}
                onCheckedChange={(checked) => setSendToAll(checked as boolean)}
              />
              <Label htmlFor="send-all" className="text-foreground">
                Enviar a todos los usuarios registrados
              </Label>
            </div>

            {!sendToAll && (
              <div className="space-y-2">
                <Label className="text-foreground">Cargar archivo CSV</Label>
                <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                  <Upload className="w-8 h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-muted-foreground mb-2">Arrastra tu archivo CSV aquí o haz clic para seleccionar</p>
                  <input type="file" accept=".csv" onChange={handleFileUpload} className="hidden" id="csv-upload" />
                  <Button
                    variant="outline"
                    onClick={() => document.getElementById("csv-upload")?.click()}
                    className="border-border text-foreground hover:bg-muted"
                  >
                    Seleccionar archivo
                  </Button>
                  {csvFile && <p className="text-sm text-primary mt-2">Archivo seleccionado: {csvFile.name}</p>}
                </div>
              </div>
            )}
          </div>

          {/* Test Section */}
          <div className="space-y-2">
            <Label htmlFor="test-number" className="text-foreground">
              Número de prueba (opcional)
            </Label>
            <div className="flex space-x-2">
              <Input
                id="test-number"
                placeholder="+34 600 000 000"
                value={testNumber}
                onChange={(e) => setTestNumber(e.target.value)}
                className="bg-input border-border text-foreground placeholder:text-muted-foreground"
              />
              <Button
                variant="outline"
                onClick={handleSendTest}
                disabled={!testNumber || !campaignType}
                className="border-border text-foreground hover:bg-muted bg-transparent"
              >
                <TestTube className="w-4 h-4 mr-2" />
                Enviar prueba
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-border text-foreground hover:bg-muted bg-transparent"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSendCampaign}
              disabled={
                !campaignType ||
                (campaignType === "event" && !selectedEvent) ||
                (campaignType === "custom" && !customMessage)
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Send className="w-4 h-4 mr-2" />
              Enviar campaña
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
