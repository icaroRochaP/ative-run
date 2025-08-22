import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Calendar, ArrowLeft, ArrowRight } from "lucide-react"
import { WorkoutCard } from "@/components/dashboard/cards/WorkoutCard"
import { TreinoTabProps } from "@/types/dashboard"

export function TreinoTab({
  workouts,
  workoutHistory,
  onWorkoutSelect,
  onHistoryWorkoutSelect,
  currentHistoryPage,
  onHistoryPageChange,
}: TreinoTabProps) {
  const historyItemsPerPage = 3
  const totalHistoryPages = Math.ceil(workoutHistory.length / historyItemsPerPage)
  
  return (
    <div className="space-y-6">
      {/* Training Plan Section */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Dumbbell className="mr-2 h-5 w-5 text-aleen-secondary" />
            Plano de Treino
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {workouts.map((workout) => (
            <WorkoutCard
              key={workout.id}
              workout={workout}
              onClick={onWorkoutSelect}
            />
          ))}
        </CardContent>
      </Card>

      {/* Training History Section */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-aleen-secondary" />
            Histórico de Treinos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 mb-4">
            {workoutHistory
              .slice(currentHistoryPage * historyItemsPerPage, (currentHistoryPage + 1) * historyItemsPerPage)
              .map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onClick={onHistoryWorkoutSelect}
                />
              ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onHistoryPageChange(Math.max(0, currentHistoryPage - 1))}
              disabled={currentHistoryPage === 0}
              className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent disabled:opacity-50 rounded-2xl font-medium transition-all duration-300"
            >
              <ArrowLeft className="h-4 w-4 mr-1" />
              Anterior
            </Button>
            <span className="text-aleen-secondary text-sm font-medium">
              Página {currentHistoryPage + 1} de {totalHistoryPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onHistoryPageChange(Math.min(totalHistoryPages - 1, currentHistoryPage + 1))}
              disabled={currentHistoryPage >= totalHistoryPages - 1}
              className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent disabled:opacity-50 rounded-2xl font-medium transition-all duration-300"
            >
              Próximo
              <ArrowRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
