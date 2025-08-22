import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target } from "lucide-react"
import { MacroGoalsCardProps } from "@/types/dashboard"

export function MacroGoalsCard({ calories, protein, carbs, fat }: MacroGoalsCardProps) {
  return (
    <Card className="bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
        <CardTitle className="text-white flex items-center">
          <Target className="mr-2 h-5 w-5" />
          Metas Diárias de Macros
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        {/* Destaque das Calorias */}
        <div className="text-center space-y-2 p-6 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-3xl shadow-lg">
          <div className="text-4xl font-bold text-white">{calories.toLocaleString()}</div>
          <div className="text-white opacity-90 font-medium">Calorias Diárias</div>
          <div className="text-sm text-white opacity-75">Meta para perda de peso</div>
        </div>

        {/* Macronutrientes */}
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-white rounded-2xl border-0 shadow-md">
            <div className="text-aleen-secondary text-sm mb-1 font-medium">Proteína</div>
            <div className="text-3xl font-bold text-gray-800">{protein}</div>
            <div className="text-gray-500 text-xs">gramas</div>
          </div>
          <div className="text-center p-4 bg-white rounded-2xl border-0 shadow-md">
            <div className="text-aleen-secondary text-sm mb-1 font-medium">Carboidratos</div>
            <div className="text-3xl font-bold text-gray-800">{carbs}</div>
            <div className="text-gray-500 text-xs">gramas</div>
          </div>
          <div className="text-center p-4 bg-white rounded-2xl border-0 shadow-md">
            <div className="text-aleen-secondary text-sm mb-1 font-medium">Gordura</div>
            <div className="text-3xl font-bold text-gray-800">{fat}</div>
            <div className="text-gray-500 text-xs">gramas</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
