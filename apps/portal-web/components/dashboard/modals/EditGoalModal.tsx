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
import { Target, Calendar } from "lucide-react"
import { useWeightGoals } from '@/hooks/useWeightGoals'

interface EditGoalModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentGoal?: {
    id: string
    target_weight: number
    target_date?: string
    notes?: string
  }
  onGoalUpdated?: () => void
}

export function EditGoalModal({ 
  open, 
  onOpenChange, 
  currentGoal,
  onGoalUpdated 
}: EditGoalModalProps) {
  const { updateGoal, loading } = useWeightGoals()
  const [formData, setFormData] = useState({
    targetWeight: currentGoal?.target_weight || '',
    targetDate: currentGoal?.target_date ? new Date(currentGoal.target_date).toISOString().split('T')[0] : '',
    notes: currentGoal?.notes || ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await updateGoal({
        target_weight: Number(formData.targetWeight),
        target_date: formData.targetDate || undefined,
        notes: formData.notes || undefined
      })
      
      onGoalUpdated?.()
      onOpenChange(false)
    } catch (error) {
      console.error('Erro ao atualizar meta:', error)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px] rounded-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center text-xl font-bold text-gray-800">
            <Target className="mr-2 h-5 w-5 text-aleen-primary" />
            Editar Meta de Peso
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="targetWeight" className="text-sm font-medium text-gray-700">
              Peso Meta (kg) *
            </Label>
            <Input
              id="targetWeight"
              type="number"
              step="0.1"
              min="30"
              max="200"
              value={formData.targetWeight}
              onChange={(e) => handleInputChange('targetWeight', e.target.value)}
              className="rounded-xl border-gray-300 focus:border-aleen-primary"
              placeholder="Ex: 75.5"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetDate" className="text-sm font-medium text-gray-700">
              <Calendar className="inline h-4 w-4 mr-1" />
              Data Meta (opcional)
            </Label>
            <Input
              id="targetDate"
              type="date"
              value={formData.targetDate}
              onChange={(e) => handleInputChange('targetDate', e.target.value)}
              className="rounded-xl border-gray-300 focus:border-aleen-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes" className="text-sm font-medium text-gray-700">
              Notas (opcional)
            </Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              className="rounded-xl border-gray-300 focus:border-aleen-primary min-h-[80px]"
              placeholder="Adicione observações sobre sua meta..."
            />
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
              disabled={loading || !formData.targetWeight}
            >
              {loading ? 'Salvando...' : 'Salvar Meta'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
