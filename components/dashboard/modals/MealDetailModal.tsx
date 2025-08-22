import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MealDetailModalProps } from "@/types/dashboard"

export function MealDetailModal({ meal, onClose, onMarkConsumed }: MealDetailModalProps) {
  if (!meal) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl my-8">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Detalhes do {meal.meal}</CardTitle>
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
        <CardContent className="p-6 space-y-6">
          {/* Meal Macros */}
          <div className="text-center space-y-2 p-6 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-3xl shadow-lg">
            <div className="text-4xl font-bold text-white">{meal.calories}</div>
            <div className="text-white/90 font-medium">Calorias</div>
            <div className="grid grid-cols-3 gap-4 mt-4">
              <div className="text-center p-3 bg-white/20 rounded-2xl">
                <div className="text-xl font-bold text-white">{meal.protein}</div>
                <div className="text-sm text-white/80 font-medium">Proteína</div>
              </div>
              <div className="text-center p-3 bg-white/20 rounded-2xl">
                <div className="text-xl font-bold text-white">{meal.carbs}</div>
                <div className="text-sm text-white/80 font-medium">Carboidratos</div>
              </div>
              <div className="text-center p-3 bg-white/20 rounded-2xl">
                <div className="text-xl font-bold text-white">{meal.fat}</div>
                <div className="text-sm text-white/80 font-medium">Gordura</div>
              </div>
            </div>
          </div>

          {/* Food List */}
          <div className="space-y-3">
            <h4 className="text-gray-800 font-bold">Ingredientes:</h4>
            <div className="space-y-2">
              {meal.foods.map((food: string, index: number) => (
                <div key={index} className="flex items-center p-3 bg-gradient-to-r from-aleen-light to-white rounded-2xl border-0 shadow-sm">
                  <div className="w-3 h-3 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-full mr-3"></div>
                  <span className="text-gray-800 font-medium">{food}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={onClose}
              className="flex-1 border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent rounded-2xl font-medium transition-all duration-300"
            >
              Fechar
            </Button>
            <Button 
              onClick={() => onMarkConsumed?.(meal)}
              className="flex-1 bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Marcar como Consumido
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
