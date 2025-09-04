import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, Dumbbell, CheckCircle, AlertCircle } from "lucide-react"
import { useWorkoutDetails } from "@/hooks/training/useWorkoutDetails"
import { WorkoutDetailSkeleton } from "./TrainingSkeletons"
import { TrainingErrorState } from "./TrainingErrorState"

interface WorkoutLogDetailModalProps {
  workoutLogId: string | null
  isOpen: boolean
  onClose: () => void
}

export function WorkoutLogDetailModal({ 
  workoutLogId, 
  isOpen, 
  onClose
}: WorkoutLogDetailModalProps) {
  const { 
    workoutDetails, 
    workoutTemplate, 
    loading, 
    error, 
    refetch 
  } = useWorkoutDetails(workoutLogId)

  if (!isOpen) return null

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString)
    return {
      date: date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    }
  }

  const isCompleted = workoutDetails?.completed_at

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
                error={error} 
                onRetry={refetch}
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
          ) : workoutDetails ? (
            <>
              <CardHeader className={`${
                isCompleted 
                  ? 'bg-gradient-to-r from-green-500 to-green-600'
                  : 'bg-gradient-to-r from-orange-500 to-orange-600'
              } text-white rounded-t-3xl flex-shrink-0`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 xs:w-12 xs:h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                      {isCompleted ? (
                        <CheckCircle className="h-5 w-5 xs:h-6 xs:w-6 text-white" />
                      ) : (
                        <AlertCircle className="h-5 w-5 xs:h-6 xs:w-6 text-white" />
                      )}
                    </div>
                    <div>
                      <CardTitle className="text-white text-sm xs:text-base leading-tight">
                        {workoutDetails.workout_template?.name || 'Treino sem modelo'}
                      </CardTitle>
                      <div className="flex flex-col xs:flex-row xs:items-center mt-1 space-y-1 xs:space-y-0 xs:space-x-3">
                        <div className="flex items-center">
                          <Calendar className="h-3 w-3 xs:h-4 xs:w-4 text-white/80 mr-1" />
                          <p className="text-white/80 text-xs xs:text-sm">
                            {formatDateTime(workoutDetails.started_at).date}
                          </p>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 xs:h-4 xs:w-4 text-white/80 mr-1" />
                          <p className="text-white/80 text-xs xs:text-sm">
                            {formatDateTime(workoutDetails.started_at).time}
                          </p>
                        </div>
                      </div>
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
                
                <div className="flex items-center justify-between mt-4">
                  <Badge 
                    className={`${
                      isCompleted
                        ? 'bg-white/20 text-white border-white/30'
                        : 'bg-white/20 text-white border-white/30'
                    } text-xs xs:text-sm`}
                  >
                    {isCompleted ? 'Treino Concluído' : 'Treino Incompleto'}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="flex-1 overflow-y-auto p-4 xs:p-6 space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-r from-aleen-light to-white rounded-xl p-3 text-center">
                    <div className="text-xs text-aleen-secondary font-medium">Séries Realizadas</div>
                    <div className="text-sm xs:text-lg font-bold text-gray-800">
                      {workoutDetails.completed_sets}
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-aleen-light to-white rounded-xl p-3 text-center">
                    <div className="text-xs text-aleen-secondary font-medium">Status</div>
                    <div className="text-sm xs:text-lg font-bold text-gray-800">
                      {isCompleted ? 'Completo' : 'Parcial'}
                    </div>
                  </div>
                </div>

                {/* Workout Template Details */}
                {workoutTemplate && (
                  <div className="space-y-3">
                    <h3 className="text-gray-800 font-bold text-base xs:text-lg flex items-center">
                      <Dumbbell className="h-4 w-4 xs:h-5 xs:w-5 mr-2 text-aleen-secondary" />
                      Exercícios ({workoutTemplate.workout_template_exercises.length})
                    </h3>
                    
                    {workoutTemplate.workout_template_exercises.map((templateExercise, index) => (
                      <Card key={templateExercise.id} className="bg-gradient-to-r from-aleen-light to-white border-0 shadow-md rounded-2xl">
                        <CardContent className="p-3 xs:p-4">
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1 min-w-0">
                              <h4 className="text-gray-800 font-bold text-sm xs:text-base leading-tight">
                                {index + 1}. {templateExercise.exercise.name}
                              </h4>
                              {templateExercise.exercise.target_muscle_groups && (
                                <p className="text-aleen-secondary text-xs xs:text-sm mt-1">
                                  {templateExercise.exercise.target_muscle_groups.join(', ')}
                                </p>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-3 gap-2 xs:gap-3 text-center">
                            <div className="bg-white rounded-xl p-2">
                              <div className="text-xs text-aleen-secondary font-medium">Séries</div>
                              <div className="text-sm xs:text-lg font-bold text-gray-800">
                                {templateExercise.target_sets}
                              </div>
                            </div>
                            <div className="bg-white rounded-xl p-2">
                              <div className="text-xs text-aleen-secondary font-medium">Reps</div>
                              <div className="text-sm xs:text-lg font-bold text-gray-800">
                                {templateExercise.target_reps || '-'}
                              </div>
                            </div>
                            <div className="bg-white rounded-xl p-2">
                              <div className="text-xs text-aleen-secondary font-medium">Pausa</div>
                              <div className="text-xs xs:text-sm font-bold text-gray-800">
                                {templateExercise.target_rest_seconds ? 
                                  `${Math.floor(templateExercise.target_rest_seconds / 60)}min` : 
                                  '-'
                                }
                              </div>
                            </div>
                          </div>
                          
                          {templateExercise.notes && (
                            <div className="mt-3 p-2 bg-white rounded-xl">
                              <p className="text-xs text-gray-600">
                                💡 {templateExercise.notes}
                              </p>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}

                {/* Workout Notes */}
                {workoutDetails.notes && (
                  <div className="bg-gradient-to-r from-aleen-light to-white rounded-xl p-4">
                    <h4 className="text-gray-800 font-bold mb-2 text-sm xs:text-base">Observações do Treino</h4>
                    <p className="text-gray-600 text-xs xs:text-sm">
                      {workoutDetails.notes}
                    </p>
                  </div>
                )}
              </CardContent>

              {/* Close Button - Fixed at bottom */}
              <div className="p-4 xs:p-6 border-t border-gray-100 flex-shrink-0">
                <Button
                  onClick={onClose}
                  className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-primary/90 hover:to-aleen-secondary/90 text-white font-medium rounded-2xl transition-all duration-300 text-sm xs:text-base py-3"
                >
                  Fechar
                </Button>
              </div>
            </>
          ) : (
            <div className="p-6 text-center">
              <p className="text-gray-600">Treino não encontrado</p>
              <Button
                onClick={onClose}
                className="w-full mt-4"
                variant="outline"
              >
                Fechar
              </Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
