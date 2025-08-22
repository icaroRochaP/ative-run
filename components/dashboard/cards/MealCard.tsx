import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MealCardProps } from "@/types/dashboard"

export function MealCard({ meal, onClick }: MealCardProps) {
  return (
    <Card
      className="bg-gradient-to-r from-aleen-light to-white border-0 cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105 rounded-2xl"
      onClick={() => onClick?.(meal)}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="text-gray-800 font-bold">{meal.meal}</h3>
          <Badge className="bg-gradient-to-r from-aleen-secondary to-aleen-purple text-white border-0 rounded-xl font-medium">
            {meal.calories} cal
          </Badge>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
          <div className="text-center">
            <div className="text-aleen-secondary font-medium">Proteína</div>
            <div className="text-gray-800 font-bold">{meal.protein}</div>
          </div>
          <div className="text-center">
            <div className="text-aleen-secondary font-medium">Carboidratos</div>
            <div className="text-gray-800 font-bold">{meal.carbs}</div>
          </div>
          <div className="text-center">
            <div className="text-aleen-secondary font-medium">Gordura</div>
            <div className="text-gray-800 font-bold">{meal.fat}</div>
          </div>
        </div>
        <div className="text-xs text-aleen-secondary font-medium">Clique para ver detalhes</div>
      </CardContent>
    </Card>
  )
}
