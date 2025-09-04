'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Camera, ChevronLeft, ChevronRight, X } from "lucide-react"
import Image from "next/image"

interface ProgressPhoto {
  date: string
  weight: string
  image: string
}

interface ProgressPhotoDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  photos: ProgressPhoto[]
  initialIndex: number
}

export function ProgressPhotoDetailModal({ 
  open, 
  onOpenChange, 
  photos,
  initialIndex 
}: ProgressPhotoDetailModalProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  if (!photos.length) return null

  const currentPhoto = photos[currentIndex]

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : photos.length - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev < photos.length - 1 ? prev + 1 : 0))
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white p-6">
          <DialogTitle className="flex items-center justify-between text-xl font-bold">
            <div className="flex items-center">
              <Camera className="mr-2 h-5 w-5" />
              Foto de Progresso
            </div>
            <div className="text-sm font-normal">
              {currentIndex + 1} de {photos.length}
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="relative">
          {/* Navegação */}
          {photos.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={goToNext}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black/50 hover:bg-black/70 text-white rounded-full h-10 w-10 p-0"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </>
          )}

          {/* Imagem Principal */}
          <div className="relative">
            <Image
              src={currentPhoto.image || "/placeholder.svg"}
              alt={`Progresso ${currentPhoto.date}`}
              width={700}
              height={500}
              className="w-full h-auto max-h-[50vh] object-contain bg-gray-100"
            />
          </div>
        </div>

        <div className="p-6 space-y-4">
          {/* Informações da Foto */}
          <div className="text-center space-y-2">
            <div className="text-2xl font-bold text-gray-800">{currentPhoto.weight} kg</div>
            <div className="text-gray-600">{formatDate(currentPhoto.date)}</div>
          </div>

          {/* Thumbnail Navigation */}
          {photos.length > 1 && (
            <div className="flex justify-center space-x-2 py-4">
              <div className="flex space-x-2 overflow-x-auto max-w-full">
                {photos.map((photo, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`relative flex-shrink-0 rounded-lg overflow-hidden transition-all ${
                      index === currentIndex 
                        ? 'ring-2 ring-aleen-primary' 
                        : 'opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={photo.image || "/placeholder.svg"}
                      alt={`Thumbnail ${photo.date}`}
                      width={60}
                      height={80}
                      className="w-15 h-20 object-cover"
                    />
                    {index === currentIndex && (
                      <div className="absolute inset-0 bg-aleen-primary/20" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Estatísticas de Progresso */}
          <div className="bg-gradient-to-r from-aleen-light to-white rounded-2xl p-4">
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-gray-800">{photos.length}</div>
                <div className="text-xs text-gray-500">Total de Fotos</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">{currentPhoto.weight}</div>
                <div className="text-xs text-gray-500">Peso Atual</div>
              </div>
              <div>
                <div className="text-lg font-bold text-gray-800">{currentIndex + 1}º</div>
                <div className="text-xs text-gray-500">Registro</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <Button
            onClick={() => onOpenChange(false)}
            className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white rounded-xl"
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
