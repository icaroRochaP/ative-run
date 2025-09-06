import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Dumbbell, Clock, Target } from "lucide-react"
import { formatDuration } from "@/lib/training"
import { cn } from "@/lib/utils"
import type { WeeklyWorkoutSchedule } from "@/lib/training"

interface WorkoutTemplateCardProps {
  workout: WeeklyWorkoutSchedule['workouts'][0]
  onClick?: () => void
}

export function WorkoutTemplateCard({ workout, onClick }: WorkoutTemplateCardProps) {
  const dayEmojis: Record<string, string> = {
    'segunda-feira': '💪',
    'terça-feira': '🔥',
    'quarta-feira': '⚡',
    'quinta-feira': '💯',
    'sexta-feira': '🚀',
    'sábado': '🎯',
    'domingo': '✨'
  }

  const dayNames: Record<string, string> = {
    'segunda-feira': 'Segunda',
    'terça-feira': 'Terça',
    'quarta-feira': 'Quarta',
    'quinta-feira': 'Quinta',
    'sexta-feira': 'Sexta',
    'sábado': 'Sábado',
    'domingo': 'Domingo'
  }

  const emoji = dayEmojis[workout.day_of_week] || '💪'
  const dayName = dayNames[workout.day_of_week] || workout.day_of_week

  return (
    <Card
      className="border-0 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg rounded-2xl relative overflow-hidden bg-gradient-to-r from-aleen-light to-white"
      onClick={onClick}
    >
      <CardContent className="p-3 sm:p-4">
        {/* Layout responsivo: vertical em 320px, horizontal em telas maiores */}
        <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between space-y-3 xs:space-y-0">
          {/* Lado esquerdo - Informações principais */}
          <div className="flex items-center space-x-2 sm:space-x-3 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center shadow-md flex-shrink-0 bg-gradient-to-br from-aleen-primary to-aleen-secondary">
              <span className="text-lg sm:text-2xl">{emoji}</span>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1 sm:space-x-2 mb-1">
                <h3 className="font-bold text-sm sm:text-base text-gray-800 leading-tight">
                  {workout.workout_template.name}
                </h3>
              </div>
              
              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs">
                <div className="flex items-center">
                  <Target className="h-3 w-3 mr-1 flex-shrink-0 text-aleen-secondary" />
                  <span className="font-medium text-aleen-secondary">
                    {dayName}
                  </span>
                </div>
                
                {workout.workout_template.estimated_duration_minutes && (
                  <div className="flex items-center">
                    <Clock className="h-3 w-3 mr-1 flex-shrink-0 text-aleen-secondary" />
                    <span className="font-medium text-aleen-secondary">
                      {formatDuration(workout.workout_template.estimated_duration_minutes)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Lado direito - Estatísticas - Em telas pequenas fica embaixo */}
          <div className="xs:text-right xs:ml-2 sm:ml-3 flex-shrink-0">
            <div className="flex xs:flex-col justify-between xs:justify-start items-start">
              <div className="font-bold text-sm text-gray-800">
                {workout.total_exercises} exercício{workout.total_exercises !== 1 ? 's' : ''}
              </div>
              <div className="text-xs font-medium text-aleen-secondary xs:mt-1">
                {workout.total_sets} série{workout.total_sets !== 1 ? 's' : ''} planejadas
              </div>
            </div>
          </div>
        </div>

        {/* Descrição opcional */}
        {workout.workout_template.description && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-xs text-gray-600 line-clamp-2">
              💡 {workout.workout_template.description}
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
