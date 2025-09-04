import { Button } from "@/components/ui/button"
import { Dumbbell, PlusCircle, Target, Calendar } from "lucide-react"

interface EmptyTrainingStateProps {
  type: 'no-plan' | 'no-history'
  onAction?: () => void
}

export function EmptyTrainingState({ type, onAction }: EmptyTrainingStateProps) {
  if (type === 'no-plan') {
    return (
      <div className="text-center py-12">
        <div className="w-20 h-20 bg-gradient-to-br from-aleen-light to-aleen-primary/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <Target className="h-10 w-10 text-aleen-secondary" />
        </div>
        <h3 className="text-xl font-bold text-gray-800 mb-3">
          Nenhum plano de treino ativo
        </h3>
        <p className="text-gray-600 mb-6 max-w-sm mx-auto">
          Você ainda não possui um plano de treino personalizado. Nossa IA pode criar um programa ideal para seus objetivos!
        </p>
        <Button
          onClick={onAction}
          className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-primary/90 hover:to-aleen-secondary/90 text-white font-medium rounded-2xl px-6 transition-all duration-300"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Criar Plano de Treino
        </Button>
        <div className="mt-6 text-xs text-gray-500">
          💡 Seu plano será personalizado com base no seu perfil e objetivos
        </div>
      </div>
    )
  }

  if (type === 'no-history') {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 bg-gradient-to-br from-aleen-light to-aleen-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Calendar className="h-8 w-8 text-aleen-secondary" />
        </div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">
          Nenhum treino realizado
        </h3>
        <p className="text-gray-600 text-sm max-w-sm mx-auto">
          Quando você completar seu primeiro treino, ele aparecerá aqui com todos os detalhes.
        </p>
        <div className="mt-4 text-xs text-gray-500">
          🚀 Comece hoje mesmo e acompanhe seu progresso!
        </div>
      </div>
    )
  }

  return null
}
