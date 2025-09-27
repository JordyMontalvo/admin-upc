"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card } from "@/components/ui/card"
import { Plus, Settings, Phone, Trash2, User, Cog } from "lucide-react"
import Link from "next/link"

export function Navbar() {
  // Estado para gestionar números de teléfono de prueba para campañas
  const [testNumbers, setTestNumbers] = useState([
    { id: 1, name: "Admin Principal", number: "+34 600 123 456" },
    { id: 2, name: "Marketing", number: "+34 600 789 012" },
  ])
  // Estado para el formulario de nuevo número de prueba
  const [newNumber, setNewNumber] = useState({ name: "", number: "" })
  // Estados para controlar la apertura de los diferentes diálogos del menú de ajustes
  const [isTestNumbersOpen, setIsTestNumbersOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isAccountOpen, setIsAccountOpen] = useState(false)

  // Función para agregar un nuevo número de teléfono de prueba
  const addTestNumber = () => {
    if (newNumber.name && newNumber.number) {
      setTestNumbers([
        ...testNumbers,
        {
          id: Date.now(),
          name: newNumber.name,
          number: newNumber.number,
        },
      ])
      setNewNumber({ name: "", number: "" })
    }
  }

  // Función para eliminar un número de teléfono de prueba existente
  const removeTestNumber = (id: number) => {
    setTestNumbers(testNumbers.filter((num) => num.id !== id))
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center">
          <h1 className="text-2xl font-bold text-gray-900">Bot Cultural</h1>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center space-x-4">
          {/* Settings Menu - BOTÓN DE AJUSTES COMENTADO/DESACTIVADO */}
          {/* 
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Ajustes
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Cog className="w-4 h-4 mr-2" />
                    Settings
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configuración General</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Configuraciones del Sistema</Label>
                      <p className="text-sm text-gray-500">Próximamente: configuraciones avanzadas del sistema.</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isAccountOpen} onOpenChange={setIsAccountOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <User className="w-4 h-4 mr-2" />
                    Cuenta
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Información de Cuenta</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Perfil de Usuario</Label>
                      <p className="text-sm text-gray-500">
                        Próximamente: gestión de perfil y configuraciones de cuenta.
                      </p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isTestNumbersOpen} onOpenChange={setIsTestNumbersOpen}>
                <DialogTrigger asChild>
                  <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                    <Phone className="w-4 h-4 mr-2" />
                    Números de Prueba
                  </DropdownMenuItem>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Configurar Números de Prueba</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Números Configurados</Label>
                      {testNumbers.map((testNum) => (
                        <Card key={testNum.id} className="p-3">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="font-medium text-sm">{testNum.name}</p>
                              <p className="text-xs text-gray-500">{testNum.number}</p>
                            </div>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removeTestNumber(testNum.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </Card>
                      ))}
                    </div>

                    <div className="space-y-3 pt-4 border-t">
                      <Label className="text-sm font-medium">Agregar Nuevo Número</Label>
                      <div className="space-y-2">
                        <Input
                          placeholder="Nombre (ej: Admin, Marketing)"
                          value={newNumber.name}
                          onChange={(e) => setNewNumber({ ...newNumber, name: e.target.value })}
                        />
                        <Input
                          placeholder="+34 600 123 456"
                          value={newNumber.number}
                          onChange={(e) => setNewNumber({ ...newNumber, number: e.target.value })}
                        />
                        <Button onClick={addTestNumber} className="w-full" size="sm">
                          <Phone className="w-4 h-4 mr-2" />
                          Agregar Número
                        </Button>
                      </div>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </DropdownMenuContent>
          </DropdownMenu>
          */}

          {/* Nueva Campaña Button */}
          <Link href="/nueva-campana">
            <Button className="bg-blue-600 text-white hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Campaña
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  )
}
