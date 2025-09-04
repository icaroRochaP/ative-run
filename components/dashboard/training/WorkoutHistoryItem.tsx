import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, Target, AlertTriangle } from "lucide-react"
import { formatDuration } from "@/lib/training"
import { cn } from "@/lib/utils"
import type { WorkoutLogWithDetails } from "@/lib/training"

interface WorkoutHistoryItemProps {
  workoutLog: WorkoutLogWithDetails
  onClick?: () => void
  onDetailClick?: (workoutLogId: string) => void
}

export function WorkoutHistoryItem({ workoutLog, onClick, onDetailClick }: WorkoutHistoryItemProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    
    // Check if it's today
    if (date.toDateString() === today.toDateString()) {
      return 'Hoje'
    }
    
    // Check if it's yesterday
    if (date.toDateString() === yesterday.toDateString()) {
      return 'Ontem'
    }
    
    // Otherwise format as dd/mm/yyyy
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('pt-BR', {
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const isCompleted = !!workoutLog.completed_at
  const workoutName = workoutLog.workout_template?.name || 'Treino sem modelo'

  const handleClick = () => {
    if (onDetailClick) {
      onDetailClick(workoutLog.id)
    } else if (onClick) {
      onClick()
    }
  }

  // Gerar emoji baseado no dia da semana ou tipo de treino
  const generateEmoji = (name: string) => {
    const nameUpper = name.toUpperCase()
    if (nameUpper.includes('PEITO') || nameUpper.includes('TRICEPS')) return '💪'
    if (nameUpper.includes('COSTAS') || nameUpper.includes('BICEPS')) return '🔥'
    if (nameUpper.includes('PERNA') || nameUpper.includes('INFERIOR')) return '🦵'
    if (nameUpper.includes('OMBRO') || nameUpper.includes('SUPERIOR')) return '⚡'
    if (nameUpper.includes('CARDIO') || nameUpper.includes('CORE')) return '🏃'
    return '💯'
  }

  const emoji = generateEmoji(workoutName)

  return (
    <Card
      className={cn(
        "border cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-2xl relative overflow-hidden",
        isCompleted 
          ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-emerald-200 shadow-md hover:border-emerald-300" 
          : "bg-gradient-to-r from-orange-50 to-orange-100 border-orange-200 shadow-md hover:border-orange-300"
      )}
      onClick={handleClick}
    >
      <CardContent className="p-3 sm:p-4">
        {/* Layout responsivo: vertical em 320px, horizontal em telas maiores */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-3 xs:space-y-0">
          {/* Lado esquerdo - Informações principais */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className={cn(
              "w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0",
              isCompleted
                ? "bg-gradient-to-br from-emerald-500 to-emerald-600"
                : "bg-gradient-to-br from-orange-500 to-orange-600"
            )}>
              <span className="text-lg sm:text-2xl">{emoji}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                <h3 className={cn(
                  "font-bold text-sm sm:text-base leading-tight",
                  isCompleted ? "text-emerald-800" : "text-orange-800"
                )}>
                  {workoutName}
                </h3>
                {isCompleted ? (
                  <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 text-emerald-600 flex-shrink-0" />
                ) : (
                  <AlertTriangle className="h-3 w-3 sm:h-4 sm:w-4 text-orange-600 flex-shrink-0" />
                )}
              </div>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center">
                  <Calendar className={cn(
                    "h-3 w-3 mr-1 flex-shrink-0",
                    isCompleted ? "text-emerald-600" : "text-orange-600"
                  )} />
                  <span className={cn(
                    "font-medium",
                    isCompleted ? "text-emerald-600" : "text-orange-600"
                  )}>
                    {formatDate(workoutLog.started_at)}
                  </span>
                </div>
                
                <div className="flex items-center">
                  <Clock className={cn(
                    "h-3 w-3 mr-1 flex-shrink-0",
                    isCompleted ? "text-emerald-600" : "text-orange-600"
                  )} />
                  <span className={cn(
                    "font-medium",
                    isCompleted ? "text-emerald-600" : "text-orange-600"
                  )}>
                    {formatTime(workoutLog.started_at)}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Lado direito - Estatísticas - Em telas pequenas fica embaixo */}
          <div className="xs:text-right xs:ml-2 sm:ml-3 flex-shrink-0">
            <div className="flex xs:flex-col justify-between xs:justify-start items-start">
              <div className={cn(
                "font-bold text-sm",
                isCompleted ? "text-emerald-800" : "text-orange-800"
              )}>
                {workoutLog.completed_sets} série{workoutLog.completed_sets !== 1 ? 's' : ''}
              </div>
              <div className={cn(
                "text-xs font-medium xs:mt-1",
                isCompleted ? "text-emerald-600" : "text-orange-600"
              )}>
                {isCompleted ? 'realizadas' : 'registradas'}
              </div>
              <div className={cn(
                "text-xs hidden sm:block xs:mt-0.5",
                isCompleted ? "text-emerald-600" : "text-orange-600"
              )}>
                {isCompleted ? 'Concluído' : 'Incompleto'}
              </div>
            </div>
          </div>
        </div>

        {/* Notas do treino */}
        {workoutLog.notes && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">
              💭 {workoutLog.notes}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
