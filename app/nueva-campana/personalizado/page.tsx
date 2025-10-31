"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ArrowLeft, Send, TestTube, MessageSquare, Bold, Italic, List, Link2, ImageIcon, Upload, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function CustomCampaignPage() {
  const router = useRouter()
  const [campaignName, setCampaignName] = useState("")
  const [customMessage, setCustomMessage] = useState("")
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [recipientCount, setRecipientCount] = useState(0)
  const [loadingCount, setLoadingCount] = useState(true)

  const maxCharacters = 1000

  // Fetch recipient count on component mount
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

    fetchRecipientCount()
  }, [])

  const handleTestSend = () => {
    console.log("Enviando mensaje de prueba personalizado...")
  }

  const handleSendCampaign = () => {
    setShowConfirmDialog(true)
  }

  const confirmSendCampaign = async () => {
    setShowConfirmDialog(false)
    
    // Obtener el conteo real de contactos antes de enviar
    try {
      const response = await fetch('/api/contacts/count')
      if (response.ok) {
        const data = await response.json()
        const actualCount = data.totalContacts || 0
        router.push(`/campana-enviada?recipients=${actualCount}&name=${encodeURIComponent(campaignName)}`)
      } else {
        // Si falla, usar el contador del estado
        router.push(`/campana-enviada?recipients=${recipientCount}&name=${encodeURIComponent(campaignName)}`)
      }
    } catch (error) {
      console.error('Error fetching recipient count:', error)
      // Si falla, usar el contador del estado
      router.push(`/campana-enviada?recipients=${recipientCount}&name=${encodeURIComponent(campaignName)}`)
    }
  }

  const insertFormatting = (format: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = customMessage.substring(start, end)

    let formattedText = ""
    let newCursorPos = start

    switch (format) {
      case "bold":
        formattedText = `*${selectedText}*`
        newCursorPos = start + 1
        break
      case "italic":
        formattedText = `_${selectedText}_`
        newCursorPos = start + 1
        break
      case "bullet":
        formattedText = `• ${selectedText}`
        newCursorPos = start + 2
        break
      case "link":
        formattedText = selectedText ? `${selectedText} https://` : "https://"
        newCursorPos = start + formattedText.length
        break
    }

    const newMessage = customMessage.substring(0, start) + formattedText + customMessage.substring(end)
    setCustomMessage(newMessage)

    // Restore cursor position
    setTimeout(() => {
      textarea.focus()
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setUploadedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeImage = () => {
    setUploadedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
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
            <h1 className="text-3xl font-bold text-foreground">Mensaje Personalizado</h1>
            <p className="text-muted-foreground mt-1">Crea un mensaje completamente personalizado</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Name */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MessageSquare className="w-5 h-5 mr-2" />
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

            {/* Message Editor */}
            <Card>
              <CardHeader>
                <CardTitle>Editor de Mensaje</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Formatting Toolbar */}
                <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-lg">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting("bold")}
                    title="Negrita (*texto*)"
                  >
                    <Bold className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting("italic")}
                    title="Cursiva (_texto_)"
                  >
                    <Italic className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting("bullet")}
                    title="Lista con viñetas"
                  >
                    <List className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => insertFormatting("link")}
                    title="Enlace"
                  >
                    <Link2 className="w-4 h-4" />
                  </Button>
                </div>

                <div>
                  <Label htmlFor="custom-message">Mensaje personalizado</Label>
                  <Textarea
                    ref={textareaRef}
                    id="custom-message"
                    placeholder="Escribe tu mensaje aquí. Usa {{1}} para personalizar con el nombre del usuario.

Ejemplos de formato:
*Texto en negrita*
_Texto en cursiva_
• Lista con viñetas
Enlaces: https://ejemplo.com"
                    value={customMessage}
                    onChange={(e) => setCustomMessage(e.target.value)}
                    rows={8}
                    maxLength={maxCharacters}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <p className="text-sm text-muted-foreground">
                      Tip: Usa <code className="bg-muted px-1 rounded">{"{{1}}"}</code> para insertar el nombre del
                      usuario
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {customMessage.length}/{maxCharacters} caracteres
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Image Upload */}
            <Card>
              <CardHeader>
                <CardTitle>Imagen (Opcional)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!uploadedImage ? (
                  <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <ImageIcon className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-sm text-muted-foreground mb-2">
                      Arrastra una imagen aquí o haz clic para seleccionar
                    </p>
                    <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                      <Upload className="w-4 h-4 mr-2" />
                      Subir imagen
                    </Button>
                    <div className="mt-4 text-xs text-muted-foreground space-y-1">
                      <p>
                        <strong>Formato recomendado:</strong> JPG, PNG
                      </p>
                      <p>
                        <strong>Tamaño recomendado:</strong> 1080x1080px (cuadrado)
                      </p>
                      <p>
                        <strong>Peso máximo:</strong> 5MB
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    <img
                      src={uploadedImage || "/placeholder.svg"}
                      alt="Imagen de la campaña"
                      className="w-full max-w-md mx-auto rounded-lg"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={removeImage}
                    >
                      <X className="w-4 h-4" />
                    </Button>
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
                  disabled={!campaignName || !customMessage}
                >
                  <TestTube className="w-4 h-4 mr-2" />
                  Enviar prueba
                </Button>
                <Button className="w-full" onClick={handleSendCampaign} disabled={!campaignName || !customMessage}>
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
                    {loadingCount ? (
                      'Cargando...'
                    ) : (
                      `${recipientCount.toLocaleString()} ${recipientCount === 1 ? 'usuario' : 'usuarios'}`
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Costo estimado:</span>
                  <span className="font-medium">$0.05 por mensaje</span>
                </div>
                {uploadedImage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Con imagen:</span>
                    <span className="font-medium">+$0.02 por mensaje</span>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* WhatsApp Format Guide */}
            <Card>
              <CardHeader>
                <CardTitle>Guía de Formato</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-xs">
                <div>
                  <code>*texto*</code> = <strong>negrita</strong>
                </div>
                <div>
                  <code>_texto_</code> = <em>cursiva</em>
                </div>
                <div>
                  <code>• texto</code> = lista con viñetas
                </div>
                <div>
                  <code>https://link</code> = enlace clickeable
                </div>
                <div>
                  <code>{"{{1}}"}</code> = nombre del usuario
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
              ¿Estás seguro de que deseas enviar la campaña "{campaignName}" a {recipientCount.toLocaleString()} {recipientCount === 1 ? 'usuario registrado' : 'usuarios registrados'}? Esta acción
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
