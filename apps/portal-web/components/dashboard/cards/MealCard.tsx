import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MealCardProps } from "@/types/dashboard"
import { ConsumptionButton } from "@/components/nutrition/ConsumptionButton"
import { cn } from "@/lib/utils"

export function MealCard({ meal, onClick, onConsumptionToggle }: MealCardProps) {
  
  // Estilos condicionais baseados no estado de consumo
  const cardStyles = cn(
    "border-0 cursor-pointer transition-all duration-300 hover:scale-105 rounded-2xl relative overflow-hidden",
    meal.isConsumed 
      ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 shadow-lg" 
      : "bg-gradient-to-r from-aleen-light to-white hover:shadow-lg"
  )

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevenir propagação se clicou no botão de consumo
    if ((e.target as HTMLElement).closest('[data-consumption-button]')) {
      return
    }
    onClick?.(meal)
  }

  const handleConsumptionToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    onConsumptionToggle?.(meal)
  }

  return (
    <Card className={cardStyles} onClick={handleCardClick}>
      <CardContent className="p-4">
        {/* Badge de Consumo no Canto Superior Direito */}
        {meal.isConsumed && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
            ✓
          </div>
        )}

        <div className="flex justify-between items-start mb-3">
          <h3 className={cn(
            "font-bold",
            meal.isConsumed ? "text-emerald-800" : "text-gray-800"
          )}>
            {meal.meal}
          </h3>
          <Badge className={cn(
            "border-0 rounded-xl font-medium",
            meal.isConsumed 
              ? "bg-emerald-600 text-white" 
              : "bg-gradient-to-r from-aleen-secondary to-aleen-purple text-white"
          )}>
            {meal.calories} cal
          </Badge>
        </div>

        <div className="grid grid-cols-3 gap-2 text-sm mb-3">
          <div className="text-center">
            <div className={cn(
              "font-medium",
              meal.isConsumed ? "text-emerald-600" : "text-aleen-secondary"
            )}>
              Proteína
            </div>
            <div className={cn(
              "font-bold",
              meal.isConsumed ? "text-emerald-800" : "text-gray-800"
            )}>
              {meal.protein}
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              "font-medium",
              meal.isConsumed ? "text-emerald-600" : "text-aleen-secondary"
            )}>
              Carboidratos
            </div>
            <div className={cn(
              "font-bold",
              meal.isConsumed ? "text-emerald-800" : "text-gray-800"
            )}>
              {meal.carbs}
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              "font-medium",
              meal.isConsumed ? "text-emerald-600" : "text-aleen-secondary"
            )}>
              Gordura
            </div>
            <div className={cn(
              "font-bold",
              meal.isConsumed ? "text-emerald-800" : "text-gray-800"
            )}>
              {meal.fat}
            </div>
          </div>
        </div>

        {/* Botão de Consumo e Texto de Ação */}
        <div className="flex items-center justify-between">
          <div className={cn(
            "text-xs font-medium",
            meal.isConsumed ? "text-emerald-600" : "text-aleen-secondary"
          )}>
            Clique para ver detalhes
          </div>
          
          {onConsumptionToggle && (
            <div data-consumption-button onClick={handleConsumptionToggle}>
              <ConsumptionButton
                isConsumed={meal.isConsumed || false}
                isLoading={meal.isConsumptionLoading || false}
                onToggle={() => {}} // Handled by parent div
                variant="icon"
                size="sm"
                className="flex-shrink-0"
              />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
