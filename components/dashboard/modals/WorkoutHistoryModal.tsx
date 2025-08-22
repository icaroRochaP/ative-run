import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WorkoutHistoryModalProps, Exercise } from "@/types/dashboard"

export function WorkoutHistoryModal({ workout, onClose, exercises }: WorkoutHistoryModalProps) {
  if (!workout) return null

  // Default exercises if none provided
  const defaultExercises: Exercise[] = [
    {
      name: "Flexões",
      sets: [
        { reps: "12", weight: "Peso Corporal", completed: true },
        { reps: "10", weight: "Peso Corporal", completed: true },
        { reps: "8", weight: "Peso Corporal", completed: true },
      ],
    },
    {
      name: "Supino Reto",
      sets: [
        { reps: "10", weight: "84 kg", completed: true },
        { reps: "8", weight: "84 kg", completed: true },
        { reps: "6", weight: "84 kg", completed: true },
      ],
    },
    {
      name: "Desenvolvimento",
      sets: [
        { reps: "12", weight: "61 kg", completed: true },
        { reps: "10", weight: "61 kg", completed: true },
      ],
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
                <p className="text-white/80 text-sm font-medium">
                  {workout.date} • {workout.duration}
                </p>
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
                <h3 className="text-gray-800 font-bold mb-3">{exercise.name}</h3>
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
                      <Badge className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white border-0 rounded-xl font-medium">
                        Completado
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
