import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Play } from "lucide-react"
import { WorkoutDetailModalProps, Exercise } from "@/types/dashboard"

export function WorkoutDetailModal({ workout, onClose, exercises }: WorkoutDetailModalProps) {
  if (!workout) return null

  // Default exercises if none provided
  const defaultExercises: Exercise[] = [
    {
      name: "Flexões",
      sets: [
        { reps: "12", weight: "Peso Corporal", completed: false },
        { reps: "10", weight: "Peso Corporal", completed: false },
        { reps: "8", weight: "Peso Corporal", completed: false },
      ],
      videoId: "IODxDxX7oi4",
    },
    {
      name: "Supino Reto",
      sets: [
        { reps: "10", weight: "84 kg", completed: false },
        { reps: "8", weight: "84 kg", completed: false },
        { reps: "6", weight: "84 kg", completed: false },
      ],
      videoId: "rT7DgCr-3pg",
    },
    {
      name: "Desenvolvimento",
      sets: [
        { reps: "12", weight: "61 kg", completed: false },
        { reps: "10", weight: "61 kg", completed: false },
      ],
      videoId: "qEwKCR5JCog",
    },
  ]

  const workoutExercises = exercises || defaultExercises

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl my-8">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <span className="text-2xl">{workout.emoji}</span>
              </div>
              <div>
                <CardTitle className="text-white">{workout.title}</CardTitle>
                <p className="text-white/80 text-sm font-medium">{workout.day}</p>
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
        </CardHeader>
        <CardContent className="p-6 space-y-4">
          {workoutExercises.map((exercise, exerciseIndex) => (
            <Card key={exerciseIndex} className="bg-gradient-to-r from-aleen-light to-white border-0 shadow-md rounded-2xl">
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-gray-800 font-bold">{exercise.name}</h3>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-2xl font-medium transition-all duration-300"
                  >
                    <Play className="h-4 w-4 mr-1" />
                    Ver Demo
                  </Button>
                </div>
                <div className="space-y-2">
                  {exercise.sets.map((set, setIndex) => (
                    <div
                      key={setIndex}
                      className="flex items-center justify-between p-3 bg-white rounded-2xl border-0 shadow-sm"
                    >
                      <span className="text-sm text-aleen-secondary font-medium">Set {setIndex + 1}</span>
                      <span className="text-sm text-gray-800 font-bold">
                        {set.reps} reps × {set.weight}
                      </span>
                      <Button
                        size="sm"
                        variant={set.completed ? "default" : "outline"}
                        className={
                          set.completed
                            ? "bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white hover:from-aleen-secondary hover:to-aleen-primary rounded-xl"
                            : "border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-xl font-medium transition-all duration-300"
                        }
                      >
                        {set.completed ? "✓" : "Completar"}
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
          <Button
            className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold py-3 mt-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={onClose}
          >
            Finalizar Treino
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
