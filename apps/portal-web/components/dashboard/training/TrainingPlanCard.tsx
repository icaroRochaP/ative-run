import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target } from "lucide-react"
import type { TrainingPlanWithWorkouts } from "@/lib/training"

interface TrainingPlanCardProps {
  trainingPlan: TrainingPlanWithWorkouts
}

export function TrainingPlanCard({ trainingPlan }: TrainingPlanCardProps) {
  const formatDate = (dateString: string | null) => {
    if (!dateString) return null
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const startDate = formatDate(trainingPlan.start_date)
  const endDate = formatDate(trainingPlan.end_date)

  return (
    <Card className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-xl font-bold">
              {trainingPlan.name}
            </CardTitle>
            {trainingPlan.objective && (
              <div className="flex items-center mt-2">
                <Target className="h-4 w-4 mr-2" />
                <span className="text-white/90 text-sm">
                  {trainingPlan.objective}
                </span>
              </div>
            )}
          </div>
          <Badge 
            variant="secondary" 
            className="bg-white/20 text-white border-0 hover:bg-white/30"
          >
            Ativo
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {(startDate || endDate) && (
          <div className="flex items-center text-white/90 text-sm">
            <Calendar className="h-4 w-4 mr-2" />
            <span>
              {startDate && endDate 
                ? `${startDate} - ${endDate}`
                : startDate 
                ? `Iniciado em ${startDate}`
                : `Até ${endDate}`
              }
            </span>
          </div>
        )}
        <div className="mt-4 text-right">
          <div className="text-white/90 text-sm">
            {trainingPlan.plan_workouts.length} treino{trainingPlan.plan_workouts.length !== 1 ? 's' : ''} por semana
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
