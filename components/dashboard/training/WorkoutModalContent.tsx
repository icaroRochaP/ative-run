import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Play, Clock, Target, Dumbbell, RotateCcw, ChevronDown, ChevronUp, Video, CheckCircle2, AlertTriangle, Check, Flag } from "lucide-react"
import { formatMuscleGroups, formatDuration, formatRestTime } from "@/lib/training"
import { cn } from "@/lib/utils"
import type { WorkoutTemplateWithExercises } from "@/lib/training"
import { useState, useEffect } from "react"
import { useWorkoutSession } from "@/hooks/training/useWorkoutSession"

interface WorkoutModalContentProps {
  workoutTemplate: WorkoutTemplateWithExercises
  onClose: () => void
  onFinishWorkout?: () => void
  completedToday?: boolean
  userId: string
}

export function WorkoutModalContent({ 
  workoutTemplate, 
  onClose, 
  onFinishWorkout,
  completedToday = false,
  userId
}: WorkoutModalContentProps) {
  // Estados para controlar os exercícios expandidos
  const [expandedExercises, setExpandedExercises] = useState<Record<string, boolean>>({})
  
  // Estado para controlar o modal de confirmação
  const [showFinishModal, setShowFinishModal] = useState(false)
  
  // Estado para evitar múltiplas operações simultâneas
  const [isFinishing, setIsFinishing] = useState(false)

  // Workout session management - now safe since workoutTemplate is guaranteed to exist
  const workoutSession = useWorkoutSession(userId, workoutTemplate.id)

  // Calcular total de sets concluídos usando os IDs corretos
  const totalSets = workoutTemplate.workout_template_exercises.reduce((acc, ex) => acc + (ex.target_sets || 0), 0)
  
  // Contar apenas os sets que realmente existem neste template
  const completedSetsCount = workoutTemplate.workout_template_exercises.reduce((count, templateExercise) => {
    const exerciseSets = Array.from({ length: templateExercise.target_sets || 0 }, (_, i) => i + 1)
    return count + exerciseSets.filter(setNumber => {
      const setId = `${templateExercise.id}-set-${setNumber}`
      return workoutSession.completedSets[setId] || false
    }).length
  }, 0)
  
  const allSetsCompleted = totalSets > 0 && completedSetsCount === totalSets

  // Debug log - removido para produção
  // console.log('Modal content props:', { workoutTemplate, userId })
  // console.log('Workout session state:', workoutSession)
  // console.log('Completed sets object:', workoutSession.completedSets)

  const formatRestTime = (seconds: number | null): string => {
    if (!seconds) return "Sem descanso"
    if (seconds < 60) return `${seconds}s`
    return `${Math.floor(seconds / 60)}min ${seconds % 60}s`
  }

  const toggleExerciseExpansion = (exerciseId: string) => {
    setExpandedExercises(prev => ({
      ...prev,
      [exerciseId]: !prev[exerciseId]
    }))
  }

  const handleSetToggle = async (setId: string, exerciseId: string, setNumber: number) => {
    // Evitar operações simultâneas
    if (workoutSession.loading || isFinishing) return
    
    try {
      // CORRIGIDO: Usar o exerciseId correto para o banco de dados
      await workoutSession.toggleSetCompletion(setId, exerciseId, setNumber)
    } catch (error) {
      console.error('Error toggling set:', error)
    }
  }

  const handleExerciseToggle = async (templateExerciseId: string) => {
    // Evitar operações simultâneas
    if (workoutSession.loading || isFinishing) return
    
    try {
      const templateExercise = workoutTemplate.workout_template_exercises.find(ex => ex.id === templateExerciseId)
      if (!templateExercise) return

      const exerciseSets = Array.from({ length: templateExercise.target_sets || 0 }, (_, i) => i + 1)
      
      // Usar templateExercise.id para identificar de forma única cada exercício no template
      // Em vez de exercise.id que pode ser duplicado
      const completedSetsForExercise = exerciseSets.filter(setNumber => {
        const setId = `${templateExercise.id}-set-${setNumber}`
        return workoutSession.completedSets[setId] || false
      }).length
      const isCompletelyDone = completedSetsForExercise === exerciseSets.length && exerciseSets.length > 0
      
      // Se está completamente feito, desmarcar tudo. Se não está, marcar tudo.
      const shouldComplete = !isCompletelyDone
      
      // Usar Promise.all para executar todas as operações em paralelo - isso elimina o delay visual
      const togglePromises = exerciseSets.map(async (setNumber) => {
        const setId = `${templateExercise.id}-set-${setNumber}`
        const isCurrentlyCompleted = workoutSession.completedSets[setId] || false
        
        // Se deve completar e não está completo, ou se deve descompletar e está completo
        if (shouldComplete !== isCurrentlyCompleted) {
          // CORRIGIDO: Usar templateExercise.exercise.id para salvar no banco (FK constraint)
          // mas manter templateExercise.id no setId para identificação única no template
          return workoutSession.toggleSetCompletion(setId, templateExercise.exercise.id, setNumber)
        }
      })
      
      // Aguardar todas as operações completarem em paralelo
      await Promise.all(togglePromises.filter(Boolean))
    } catch (error) {
      console.error('Error toggling exercise:', error)
    }
  }

  const handleSingleSetToggle = async (templateExerciseId: string) => {
    // Evitar operações simultâneas
    if (workoutSession.loading || isFinishing) return
    
    try {
      const templateExercise = workoutTemplate.workout_template_exercises.find(ex => ex.id === templateExerciseId)
      if (!templateExercise) return

      const exerciseSets = Array.from({ length: templateExercise.target_sets || 0 }, (_, i) => i + 1)
      
      // Encontrar a próxima série não completa para marcar
      let nextSetToToggle = null
      for (const setNumber of exerciseSets) {
        const setId = `${templateExercise.id}-set-${setNumber}`
        const isCompleted = workoutSession.completedSets[setId] || false
        
        if (!isCompleted) {
          nextSetToToggle = setNumber
          break
        }
      }
      
      // Se todas as séries estão completas, desmarcar a última
      if (nextSetToToggle === null) {
        nextSetToToggle = exerciseSets[exerciseSets.length - 1]
      }
      
      if (nextSetToToggle) {
        const setId = `${templateExercise.id}-set-${nextSetToToggle}`
        await workoutSession.toggleSetCompletion(setId, templateExercise.exercise.id, nextSetToToggle)
      }
    } catch (error) {
      console.error('Error toggling single set:', error)
    }
  }

  const handleFinishWorkout = async (forceComplete = false) => {
    // Evitar execuções simultâneas
    if (isFinishing || workoutSession.loading || workoutSession.isFinished) return
    
    try {
      setIsFinishing(true)
      const allSetsCompleted = totalSets > 0 && completedSetsCount === totalSets
      
      // Se nem todas as séries estão completas e não é forçado, mostrar modal
      if (!allSetsCompleted && !forceComplete) {
        setShowFinishModal(true)
        return
      }
      
      await workoutSession.finishWorkout(allSetsCompleted || forceComplete)
      setShowFinishModal(false)
      onFinishWorkout?.()
    } catch (error) {
      console.error('Error finishing workout:', error)
    } finally {
      setIsFinishing(false)
    }
  }

  const handleConfirmFinish = () => {
    handleFinishWorkout(true)
  }

  const handleCancelFinish = () => {
    setShowFinishModal(false)
  }

  const isExerciseExpanded = (exerciseId: string) => expandedExercises[exerciseId] || false
  const isSetCompleted = (setId: string) => workoutSession.completedSets[setId] || false

  return (
    <>
      <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 xs:w-12 xs:h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <Dumbbell className="h-5 w-5 xs:h-6 xs:w-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-white text-sm xs:text-base leading-tight">{workoutTemplate.name}</CardTitle>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
          >
            ✕
          </Button>
        </div>
        
        {workoutTemplate.description && (
          <p className="text-white/90 text-xs xs:text-sm mt-2 leading-relaxed">
            {workoutTemplate.description}
          </p>
        )}
        
        {workoutTemplate.objective && (
          <div className="flex items-center mt-2">
            <Target className="h-3 w-3 xs:h-4 xs:w-4 text-white/80 mr-2" />
            <span className="text-white/90 text-xs xs:text-sm">{workoutTemplate.objective}</span>
          </div>
        )}
      </CardHeader>
      
      <CardContent className="flex-1 overflow-y-auto p-4 xs:p-6 space-y-4">
        {/* Progress indicator */}
        <div className="bg-gradient-to-r from-aleen-light to-white rounded-xl p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs xs:text-sm font-medium text-gray-800">Progresso</span>
            <span className="text-xs xs:text-sm font-bold text-aleen-secondary">
              {completedSetsCount} / {totalSets}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-aleen-primary to-aleen-secondary h-2 rounded-full transition-all duration-300"
              style={{ width: `${totalSets > 0 ? (completedSetsCount / totalSets) * 100 : 0}%` }}
            />
          </div>
        </div>

        {/* Exercise list */}
        <div className="space-y-3">
          <h3 className="text-gray-800 font-bold text-base xs:text-lg">
            Exercícios ({workoutTemplate.workout_template_exercises.length})
          </h3>
          
          {workoutTemplate.workout_template_exercises.map((templateExercise, index) => {
            const isExpanded = isExerciseExpanded(templateExercise.id)
            const exerciseSets = Array.from({ length: templateExercise.target_sets || 0 }, (_, i) => i + 1)
            
            // Calcular sets completos para este exercício
            const completedSetsForExercise = exerciseSets.filter(setNumber => {
              const setId = `${templateExercise.id}-set-${setNumber}`
              return workoutSession.completedSets[setId] || false
            }).length
            const allSetsCompleted = completedSetsForExercise === exerciseSets.length && exerciseSets.length > 0
            
            return (
              <Card 
                key={templateExercise.id} 
                className={cn(
                  "border-0 shadow-md rounded-2xl transition-all duration-300 relative",
                  allSetsCompleted 
                    ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 shadow-lg" 
                    : "bg-gradient-to-r from-aleen-light to-white"
                )}
              >
                <CardContent className="p-3 xs:p-4">
                  {/* Badge de Conclusão no Canto Superior Direito */}
                  {allSetsCompleted && (
                    <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full w-5 h-5 xs:w-6 xs:h-6 flex items-center justify-center text-xs font-bold shadow-lg">
                      ✓
                    </div>
                  )}

                  {/* Exercise header */}
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1 min-w-0 pr-2">
                      <h4 className={cn(
                        "font-bold text-sm xs:text-base leading-tight",
                        allSetsCompleted ? "text-emerald-800" : "text-gray-800"
                      )}>
                        {index + 1}. {templateExercise.exercise.name}
                      </h4>
                      {templateExercise.exercise.target_muscle_groups && (
                        <p className={cn(
                          "text-xs xs:text-sm mt-1",
                          allSetsCompleted ? "text-emerald-600" : "text-aleen-secondary"
                        )}>
                          {formatMuscleGroups(templateExercise.exercise.target_muscle_groups)}
                        </p>
                      )}
                    </div>
                    
                    {/* Botões de ação - layout vertical em 320px */}
                    <div className="flex flex-col xs:flex-row items-end xs:items-center space-y-1 xs:space-y-0 xs:space-x-2 flex-shrink-0">
                      {/* Botão para marcar próxima série como completa */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleSingleSetToggle(templateExercise.id)}
                        className={cn(
                          "flex items-center gap-1 text-xs px-2 py-1 h-6 xs:h-7 transition-all duration-200 rounded-xl min-w-0",
                          allSetsCompleted 
                            ? "bg-emerald-500 text-white border-emerald-500 hover:bg-emerald-600" 
                            : "text-emerald-600 border-emerald-600 hover:bg-emerald-50"
                        )}
                      >
                        <Check className="w-3 h-3" />
                        <span className="hidden xs:inline">{allSetsCompleted ? 'OK' : 'Marcar'}</span>
                      </Button>

                      {templateExercise.exercise.video_url && (
                        <Button
                          size="sm"
                          variant="outline"
                          className="border border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-xl font-medium transition-all duration-300 text-xs px-2 py-1 h-6 xs:h-7"
                          onClick={() => window.open(templateExercise.exercise.video_url!, '_blank')}
                        >
                          <Video className="h-3 w-3 xs:mr-1" />
                          <span className="hidden xs:inline">Demo</span>
                        </Button>
                      )}
                      
                      <Button
                        size="sm"
                        variant="ghost"
                        className="rounded-xl p-1 h-6 xs:h-7 w-6 xs:w-7"
                        onClick={() => toggleExerciseExpansion(templateExercise.id)}
                      >
                        {isExpanded ? (
                          <ChevronUp className="h-3 w-3 xs:h-4 xs:w-4" />
                        ) : (
                          <ChevronDown className="h-3 w-3 xs:h-4 xs:w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  {/* Exercise summary */}
                  <div className="grid grid-cols-3 gap-2 xs:gap-3 text-center mb-3">
                    <div className="bg-white rounded-xl p-2">
                      <div className={cn(
                        "text-xs font-medium",
                        allSetsCompleted ? "text-emerald-600" : "text-aleen-secondary"
                      )}>
                        Séries
                      </div>
                      <div className={cn(
                        "text-sm xs:text-lg font-bold",
                        allSetsCompleted ? "text-emerald-800" : "text-gray-800"
                      )}>
                        {completedSetsForExercise}/{templateExercise.target_sets}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2">
                      <div className={cn(
                        "text-xs font-medium",
                        allSetsCompleted ? "text-emerald-600" : "text-aleen-secondary"
                      )}>
                        Reps
                      </div>
                      <div className={cn(
                        "text-sm xs:text-lg font-bold",
                        allSetsCompleted ? "text-emerald-800" : "text-gray-800"
                      )}>
                        {templateExercise.target_reps || '-'}
                      </div>
                    </div>
                    <div className="bg-white rounded-xl p-2">
                      <div className={cn(
                        "text-xs font-medium",
                        allSetsCompleted ? "text-emerald-600" : "text-aleen-secondary"
                      )}>
                        Pausa
                      </div>
                      <div className={cn(
                        "text-xs xs:text-sm font-bold",
                        allSetsCompleted ? "text-emerald-800" : "text-gray-800"
                      )}>
                        {formatRestTime(templateExercise.target_rest_seconds)}
                      </div>
                    </div>
                  </div>

                  {/* Individual sets - shown when expanded */}
                  {isExpanded && (
                    <div className="space-y-2 mt-4">
                      <h5 className="text-xs xs:text-sm font-semibold text-gray-700 mb-2">Marcar séries:</h5>
                      {exerciseSets.map((setNumber) => {
                        const setId = `${templateExercise.id}-set-${setNumber}`
                        const isCompleted = isSetCompleted(setId)
                        
                        return (
                          <div 
                            key={setId}
                            className={`flex items-center justify-between p-2 xs:p-3 rounded-xl transition-all duration-200 ${
                              isCompleted 
                                ? 'bg-green-50 border-2 border-green-200' 
                                : 'bg-white border-2 border-gray-100 hover:border-aleen-secondary/30'
                            }`}
                          >
                            <div className="flex items-center space-x-2 xs:space-x-3">
                              <Checkbox
                                checked={isCompleted}
                                onCheckedChange={() => handleSetToggle(setId, templateExercise.exercise.id, setNumber)}
                                className="data-[state=checked]:bg-green-500 data-[state=checked]:border-green-500"
                              />
                              <span className="font-medium text-gray-800 text-xs xs:text-sm">
                                Série {setNumber}
                              </span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <span className="text-xs xs:text-sm text-gray-600">
                                {templateExercise.target_reps || '-'} reps
                              </span>
                              {isCompleted && (
                                <CheckCircle2 className="h-3 w-3 xs:h-4 xs:w-4 text-green-500" />
                              )}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                  
                  {templateExercise.notes && (
                    <div className="mt-3 p-2 bg-white rounded-xl">
                      <p className="text-xs text-gray-600">
                        💡 {templateExercise.notes}
                      </p>
                    </div>
                  )}
                  
                  {templateExercise.exercise.description && (
                    <div className="mt-2">
                      <p className="text-xs text-gray-600">
                        {templateExercise.exercise.description}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>

      {/* Finish workout button - Fixed at bottom */}
      <div className="p-4 xs:p-6 border-t border-gray-100 flex-shrink-0">
        {workoutSession.error && (
          <div className="mb-3 p-3 bg-red-50 border border-red-200 rounded-xl flex items-center">
            <AlertTriangle className="h-4 w-4 text-red-500 mr-2" />
            <span className="text-xs xs:text-sm text-red-700">{workoutSession.error}</span>
          </div>
        )}
        
        <Button
          onClick={() => handleFinishWorkout()}
          disabled={isFinishing || workoutSession.loading || workoutSession.isFinished}
          className={`w-full font-medium rounded-2xl transition-all duration-300 text-xs xs:text-sm py-3 ${
            allSetsCompleted && !workoutSession.isFinished
              ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white'
              : !workoutSession.isFinished
                ? 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white'
                : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          {allSetsCompleted ? (
            <>
              <CheckCircle2 className="h-4 w-4 mr-2" />
              {isFinishing || workoutSession.loading 
                ? 'Finalizando...'
                : workoutSession.isFinished 
                  ? 'Treino Finalizado!'
                  : 'Finalizar Treino Completo'
              }
            </>
          ) : (
            <>
              <Flag className="h-4 w-4 mr-2" />
              {isFinishing || workoutSession.loading 
                ? 'Finalizando...'
                : workoutSession.isFinished 
                  ? 'Treino Finalizado!'
                  : 'Finalizar Treino Incompleto'
              }
            </>
          )}
        </Button>
        <p className="text-xs text-center text-gray-500 mt-2 leading-relaxed">
          {workoutSession.isFinished
            ? 'Treino concluído com sucesso!'
            : allSetsCompleted 
              ? 'Parabéns! Você completou todas as séries!' 
              : `Complete ${completedSetsCount}/${totalSets} séries ou finalize mesmo assim`
          }
        </p>
      </div>

      {/* Modal de Confirmação para Finalizar Treino Incompleto */}
      <Dialog open={showFinishModal} onOpenChange={setShowFinishModal}>
        <DialogContent className="w-[90vw] max-w-sm xs:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-sm xs:text-base">
              <AlertTriangle className="h-4 w-4 xs:h-5 xs:w-5 text-amber-500" />
              Finalizar Treino Incompleto?
            </DialogTitle>
            <DialogDescription className="text-xs xs:text-sm">
              Você completou apenas <strong>{completedSetsCount} de {totalSets} séries</strong>.
              <br /><br />
              Tem certeza que deseja finalizar este treino? Esta ação não pode ser desfeita e o treino será marcado como incompleto.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col xs:flex-row gap-2">
            <Button
              variant="outline"
              onClick={handleCancelFinish}
              className="w-full xs:w-auto text-xs xs:text-sm"
              disabled={isFinishing}
            >
              Continuar Treino
            </Button>
            <Button
              onClick={handleConfirmFinish}
              className="w-full xs:w-auto bg-amber-500 hover:bg-amber-600 text-white text-xs xs:text-sm"
              disabled={isFinishing}
            >
              {isFinishing ? 'Finalizando...' : 'Finalizar Mesmo Assim'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
