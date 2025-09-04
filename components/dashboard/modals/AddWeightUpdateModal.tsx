'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Scale, Camera, Calendar } from "lucide-react"
import { useWeightProgress, useProgressPhotos } from '@/hooks/useWeightProgress'

interface AddWeightUpdateModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onWeightAdded?: () => void
}

export function AddWeightUpdateModal({ 
  open, 
  onOpenChange, 
  onWeightAdded 
}: AddWeightUpdateModalProps) {
  const { addWeightLog, loading: weightLoading } = useWeightProgress()
  const { uploadPhoto, loading: photoLoading } = useProgressPhotos()
  
  const [formData, setFormData] = useState({
    weight: '',
    date: new Date().toISOString().split('T')[0],
    notes: ''
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)

  const loading = weightLoading || photoLoading

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Adicionar o registro de peso
      const weightProgress = await addWeightLog({
        weight: Number(formData.weight),
        date: formData.date,
        notes: formData.notes || undefined
      })

      // Se há uma foto selecionada, fazer upload
      if (selectedFile && weightProgress?.data?.id) {
        await uploadPhoto(selectedFile, {
          weight_log_id: weightProgress.data.id,
          weight: Number(formData.weight),
          date: formData.date,
          photo_type: 'front'
        })
      }
      
      onWeightAdded?.()
      onOpenChange(false)
      
      // Reset form
      setFormData({
        weight: '',
        date: new Date().toISOString().split('T')[0],
        notes: ''
      })
      setSelectedFile(null)
      setPhotoPreview(null)
    } catch (error) {
      console.error('Erro ao adicionar registro:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Por favor, selecione apenas arquivos de imagem.')
        return
      }
      
      // Verificar tamanho (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 5MB.')
        return
      }
      
      setSelectedFile(file)
      
      // Criar preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setSelectedFile(null)
    setPhotoPreview(null)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-gray-800">
            <Scale className="mr-2 h-5 w-5 text-aleen-primary" />
            Adicionar Atualização de Peso
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="weight" className="text-sm font-medium text-gray-700">
                Peso (kg) *
              </Label>
              <Input
                id="weight"
                type="number"
                step="0.1"
                min="30"
                max="200"
                value={formData.weight}
                onChange={(e) => handleInputChange('weight', e.target.value)}
                className="rounded-xl border-gray-300 focus:border-aleen-primary"
                placeholder="Ex: 75.5"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="date" className="text-sm font-medium text-gray-700">
                <Calendar className="inline h-4 w-4 mr-1" />
                Data *
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange('date', e.target.value)}
                className="rounded-xl border-gray-300 focus:border-aleen-primary"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Observações (opcional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="rounded-xl border-gray-300 focus:border-aleen-primary min-h-[80px]"
              placeholder="Como você se sente? Alguma observação..."
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium text-gray-700">
              <Camera className="inline h-4 w-4 mr-1" />
              Foto de Progresso (opcional)
            </Label>
            
            {!photoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center">
                <Camera className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="photo-upload"
                />
                <label
                  htmlFor="photo-upload"
                  className="cursor-pointer text-aleen-primary hover:text-aleen-secondary bg-transparent border-none inline-block"
                >
                  Clique para adicionar uma foto
                </label>
                <p className="text-xs text-gray-500 mt-1">Máximo 5MB • JPG, PNG</p>
              </div>
            ) : (
              <div className="relative">
                <img 
                  src={photoPreview} 
                  alt="Preview" 
                  className="w-full h-32 object-cover rounded-xl"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 rounded-full h-8 w-8 p-0"
                >
                  ×
                </Button>
              </div>
            )}
          </div>

          <DialogFooter className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white rounded-xl"
              disabled={loading || !formData.weight}
            >
              {loading ? 'Salvando...' : 'Salvar Registro'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
