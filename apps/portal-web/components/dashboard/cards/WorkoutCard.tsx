import { Card, CardContent } from "@/components/ui/card"
import { WorkoutCardProps } from "@/types/dashboard"

export function WorkoutCard({ workout, onClick }: WorkoutCardProps) {
  return (
    <Card
      className="bg-gradient-to-r from-aleen-light to-white border-0 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-2xl"
      onClick={() => onClick?.(workout)}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-2xl flex items-center justify-center">
              <span className="text-2xl">{workout.emoji}</span>
            </div>
            <div>
              <h3 className="text-gray-800 font-bold">{workout.title}</h3>
              <p className="text-aleen-secondary text-sm font-medium">{workout.day}</p>
              {workout.duration && (
                <p className="text-aleen-secondary text-sm font-medium">{workout.duration}</p>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-gray-800 font-bold">{workout.exercises} exercícios</div>
            <div className="text-aleen-secondary text-sm font-medium">
              {workout.totalSets} {workout.completed ? 'séries concluídas' : 'séries totais'}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
