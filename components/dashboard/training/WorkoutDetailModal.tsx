import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Play, Clock, Target, Dumbbell, RotateCcw, ChevronDown, ChevronUp, Video, CheckCircle2, AlertTriangle } from "lucide-react"
import { formatMuscleGroups, formatDuration } from "@/lib/training"
import type { WorkoutTemplateWithExercises } from "@/lib/training"
import { WorkoutDetailSkeleton } from "./TrainingSkeletons"
import { TrainingErrorState } from "./TrainingErrorState"
import { useState, useEffect } from "react"
import { WorkoutModalContent } from "./WorkoutModalContent"

interface WorkoutDetailModalProps {
  workoutTemplate: WorkoutTemplateWithExercises | null
  isOpen: boolean
  onClose: () => void
  onFinishWorkout?: () => void
  completedToday?: boolean
  loading?: boolean
  error?: Error | null
  userId: string
}

export function WorkoutDetailModal({ 
  workoutTemplate, 
  isOpen, 
  onClose, 
  onFinishWorkout,
  completedToday = false,
  loading = false,
  error = null,
  userId
}: WorkoutDetailModalProps) {  
  if (!isOpen) return null

  // Debug log
  console.log('Modal props:', { isOpen, workoutTemplate, loading, error, userId })

  return (
    <div className="modal-overlay-full bg-black/50 flex items-start justify-center p-2 xs:p-4 z-50 overflow-y-auto">
      <div className="w-full max-w-sm xs:max-w-md min-h-full xs:min-h-0 xs:h-auto xs:max-h-[90vh] xs:my-8 overflow-hidden">
        <Card className="h-full xs:h-auto bg-white border-0 shadow-2xl rounded-t-3xl xs:rounded-3xl flex flex-col">
          {loading ? (
            <div className="p-6">
              <WorkoutDetailSkeleton />
            </div>
          ) : error ? (
            <div className="p-6">
              <TrainingErrorState 
                error={error?.message || "Erro ao carregar detalhes do treino"} 
                onRetry={() => window.location.reload()}
                type="network"
              />
              <Button
                onClick={onClose}
                className="w-full mt-4"
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          ) : !workoutTemplate ? (
            <div className="p-6 text-center">
              <p className="text-gray-600 mb-4">Treino não encontrado</p>
              <Button
                onClick={onClose}
                className="w-full"
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          ) : (
            <div className="flex flex-col h-full xs:h-auto overflow-hidden">
              <WorkoutModalContent
                workoutTemplate={workoutTemplate}
                onClose={onClose}
                onFinishWorkout={onFinishWorkout}
                completedToday={completedToday}
                userId={userId}
              />
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
