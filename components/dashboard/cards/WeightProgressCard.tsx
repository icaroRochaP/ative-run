import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Zap, Edit } from "lucide-react"
import { WeightProgressCardProps } from "@/types/dashboard"

export function WeightProgressCard({ 
  currentWeight, 
  targetWeight, 
  startWeight, 
  onUpdateWeight,
  onEditGoal
}: WeightProgressCardProps) {
  // Calcular progresso para perda de peso
  let progressPercentage = 0
  let remainingWeight = 0
  
  if (startWeight && startWeight > 0 && targetWeight > 0) {
    // Se temos peso inicial, calcular progresso normal
    const totalWeightToLose = startWeight - targetWeight
    const weightLost = startWeight - currentWeight
    progressPercentage = Math.round((weightLost / totalWeightToLose) * 100)
    remainingWeight = currentWeight - targetWeight
  } else if (currentWeight > 0 && targetWeight > 0) {
    // Se não temos peso inicial, mas temos peso atual e meta
    if (currentWeight <= targetWeight) {
      // Meta atingida
      progressPercentage = 100
      remainingWeight = 0
    } else {
      // Ainda não atingiu a meta - calcular quanto falta
      remainingWeight = currentWeight - targetWeight
      // Para mostrar progresso, vamos assumir que precisa perder pelo menos 10% do peso atual
      const estimatedStartWeight = currentWeight * 1.1
      const totalWeightToLose = estimatedStartWeight - targetWeight
      const weightLost = estimatedStartWeight - currentWeight
      progressPercentage = Math.round((weightLost / totalWeightToLose) * 100)
    }
  }

  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
        <div className="flex items-center justify-between">
          <CardTitle className="text-white flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Progresso do Peso
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={onEditGoal}
            className="text-white hover:bg-white/20 rounded-xl"
          >
            <Edit className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Current Weight Display */}
        <div className="text-center space-y-2">
          <div className="text-4xl font-bold text-gray-800">{currentWeight} kg</div>
          <div className="text-aleen-secondary font-medium">Peso Atual</div>
          <div className="flex items-center justify-center space-x-2 text-sm">
            <span className="text-gray-500">Meta:</span>
            <span className="text-gray-800 font-medium">{targetWeight} kg</span>
            <span className="text-gray-500">•</span>
            <span className="text-gray-500">Restante:</span>
            <span className="text-gray-800 font-medium">{remainingWeight.toFixed(1)} kg</span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-aleen-secondary font-medium">Progresso</span>
            <span className="text-gray-800 font-medium">{progressPercentage}% Completo</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-4">
            <div 
              className="bg-gradient-to-r from-aleen-primary to-aleen-secondary h-4 rounded-full transition-all duration-300" 
              style={{ width: `${Math.min(Math.max(progressPercentage, 0), 100)}%` }} 
            />
          </div>
          <div className="flex justify-between text-xs text-gray-500">
            <span>Início: {startWeight} kg</span>
            <span>Meta: {targetWeight} kg</span>
          </div>
        </div>

        {/* Add Update Button */}
        <Button
          className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold py-3 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
          onClick={onUpdateWeight}
        >
          <Zap className="h-4 w-4 mr-2" />
          Adicionar Atualização de Peso
        </Button>
      </CardContent>
    </Card>
  )
}
