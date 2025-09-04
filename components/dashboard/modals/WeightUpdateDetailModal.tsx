'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Scale, Calendar, Camera, X } from "lucide-react"
import Image from "next/image"

interface WeightUpdateDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  update: {
    id: string
    weight: number
    date: string
    weightChange: number
    hasPhoto: boolean
    notes?: string
    photo_url?: string
  } | null
}

export function WeightUpdateDetailModal({ 
  open, 
  onOpenChange, 
  update 
}: WeightUpdateDetailModalProps) {
  if (!update) return null

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getWeightChangeText = (change: number) => {
    if (change > 0) return `+${change} kg (aumento)`
    if (change < 0) return `${change} kg (redução)`
    return 'Sem alteração'
  }

  const getWeightChangeColor = (change: number) => {
    if (change > 0) return 'text-red-600'
    if (change < 0) return 'text-aleen-primary'
    return 'text-gray-600'
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] rounded-2xl p-0 overflow-hidden">
        <DialogHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white p-6">
          <DialogTitle className="flex items-center text-xl font-bold">
            <Scale className="mr-2 h-5 w-5" />
            Detalhes da Atualização
          </DialogTitle>
        </DialogHeader>
        
        <div className="p-6 space-y-6">
          {/* Peso Principal */}
          <div className="text-center">
            <div className="text-5xl font-bold text-gray-800 mb-2">{update.weight} kg</div>
            <div className="text-sm text-gray-500 mb-4">{formatDate(update.date)}</div>
            
            {/* Mudança de Peso */}
            {update.weightChange !== 0 && (
              <div className={`text-lg font-semibold ${getWeightChangeColor(update.weightChange)}`}>
                {getWeightChangeText(update.weightChange)}
              </div>
            )}
          </div>

          {/* Foto (se disponível) */}
          {update.hasPhoto && update.photo_url && (
            <div className="space-y-3">
              <div className="flex items-center text-gray-700 font-medium">
                <Camera className="h-4 w-4 mr-2 text-aleen-secondary" />
                Foto de Progresso
              </div>
              <div className="relative">
                <Image
                  src={update.photo_url}
                  alt={`Progresso ${update.date}`}
                  width={400}
                  height={300}
                  className="rounded-2xl object-cover w-full max-h-80 border-2 border-aleen-light"
                />
              </div>
            </div>
          )}

          {/* Observações (se disponível) */}
          {update.notes && (
            <div className="space-y-3">
              <div className="flex items-center text-gray-700 font-medium">
                <Calendar className="h-4 w-4 mr-2 text-aleen-secondary" />
                Observações
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-gray-700">{update.notes}</p>
              </div>
            </div>
          )}

          {/* Estatísticas */}
          <div className="bg-gradient-to-r from-aleen-light to-white rounded-2xl p-4">
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-800">{update.weight}</div>
                <div className="text-sm text-gray-500">Peso Registrado</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${getWeightChangeColor(update.weightChange)}`}>
                  {update.weightChange > 0 ? '+' : ''}{update.weightChange}
                </div>
                <div className="text-sm text-gray-500">Variação (kg)</div>
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
