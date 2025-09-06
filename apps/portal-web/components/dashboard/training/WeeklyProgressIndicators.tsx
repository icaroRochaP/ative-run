import { cn } from "@/lib/utils"
import type { WeeklyWorkoutSchedule } from "@/lib/training"

interface WeeklyProgressIndicatorsProps {
  workouts: WeeklyWorkoutSchedule['workouts']
  className?: string
}

export function WeeklyProgressIndicators({ workouts, className }: WeeklyProgressIndicatorsProps) {
  // Mapeamento para garantir ordem correta dos dias
  const dayOrder = [
    'segunda-feira',
    'terça-feira', 
    'quarta-feira',
    'quinta-feira',
    'sexta-feira',
    'sábado',
    'domingo'
  ]

  const dayAbbreviations: Record<string, string> = {
    'segunda-feira': 'S',
    'terça-feira': 'T',
    'quarta-feira': 'Q',
    'quinta-feira': 'Q',
    'sexta-feira': 'S',
    'sábado': 'S',
    'domingo': 'D'
  }

  // Criar mapa de workouts por dia
  const workoutsByDay = workouts.reduce((acc, workout) => {
    acc[workout.day_of_week] = workout
    return acc
  }, {} as Record<string, typeof workouts[0]>)

  return (
    <div className={cn("flex items-center justify-center space-x-2 sm:space-x-3 py-3", className)}>
      {dayOrder.map((day) => {
        const workout = workoutsByDay[day]
        const hasWorkout = !!workout
        const isCompleted = workout?.completed_today || false
        const abbreviation = dayAbbreviations[day]

        return (
          <div key={day} className="flex flex-col items-center space-y-1.5">
            {/* Bolinha indicadora - tamanhos responsivos */}
            <div
              className={cn(
                "w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 transition-all duration-200 flex items-center justify-center",
                hasWorkout
                  ? isCompleted
                    ? "bg-emerald-500 border-emerald-500 shadow-sm ring-2 ring-emerald-200"
                    : "bg-white border-aleen-secondary hover:border-aleen-primary shadow-sm"
                  : "bg-gray-100 border-gray-200"
              )}
              title={hasWorkout ? `${day} - ${isCompleted ? 'Realizado' : 'Pendente'}` : `${day} - Sem treino`}
            >
              {/* Ícone de check para treinos concluídos */}
              {hasWorkout && isCompleted && (
                <svg className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            
            {/* Letra do dia */}
            <span
              className={cn(
                "text-xs font-medium transition-colors duration-200",
                hasWorkout
                  ? isCompleted
                    ? "text-emerald-600"
                    : "text-aleen-secondary"
                  : "text-gray-400"
              )}
            >
              {abbreviation}
            </span>
          </div>
        )
      })}
    </div>
  )
}
