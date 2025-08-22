"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Camera } from "lucide-react"
import { WeightUpdateModalProps } from "@/types/dashboard"

export function WeightUpdateModal({ isOpen, onClose, onSave }: WeightUpdateModalProps) {
  const [newWeight, setNewWeight] = useState("")
  const [newPhoto, setNewPhoto] = useState<File | null>(null)

  if (!isOpen) return null

  const handleSave = () => {
    if (newWeight) {
      onSave(newWeight, newPhoto)
      setNewWeight("")
      setNewPhoto(null)
    }
  }

  const handleClose = () => {
    onClose()
    setNewWeight("")
    setNewPhoto(null)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl my-8">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Atualizar Peso</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6 space-y-6">
          {/* Weight Input */}
          <div className="space-y-3">
            <Label htmlFor="weight" className="text-gray-800 font-bold">
              Peso Atual
            </Label>
            <div className="relative">
              <Input
                id="weight"
                type="number"
                step="0.1"
                value={newWeight}
                onChange={(e) => setNewWeight(e.target.value)}
                placeholder="72.5"
                className="border-2 border-aleen-secondary focus:border-aleen-primary text-gray-800 placeholder:text-gray-400 py-3 pr-12 rounded-2xl font-medium"
              />
              <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-aleen-secondary font-medium">kg</span>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="space-y-3">
            <Label className="text-gray-800 font-bold">Foto de Progresso (Opcional)</Label>
            <div className="border-2 border-dashed border-aleen-secondary/50 rounded-2xl p-6 text-center hover:border-aleen-secondary transition-colors bg-gradient-to-br from-aleen-light to-white">
              {newPhoto ? (
                <div className="space-y-3">
                  <div className="w-20 h-20 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-2xl mx-auto flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <p className="text-sm text-gray-800 font-bold">{newPhoto.name}</p>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNewPhoto(null)}
                    className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-2xl font-medium transition-all duration-300"
                  >
                    Remover Foto
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-2xl mx-auto flex items-center justify-center">
                    <Camera className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <p className="text-gray-800 font-bold mb-1">Adicionar uma foto de progresso</p>
                    <p className="text-aleen-secondary text-sm font-medium">Capture sua jornada de transformação</p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      // Simulate file selection
                      const fakeFile = new File([""], "progress-photo.jpg", { type: "image/jpeg" })
                      setNewPhoto(fakeFile)
                    }}
                    className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-2xl font-medium transition-all duration-300"
                  >
                    Escolher Foto
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={handleClose}
              className="flex-1 border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-2xl font-medium transition-all duration-300"
            >
              Cancelar
            </Button>
            <Button
              onClick={handleSave}
              disabled={!newWeight}
              className="flex-1 bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold disabled:opacity-50 disabled:cursor-not-allowed rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Salvar Atualização
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
