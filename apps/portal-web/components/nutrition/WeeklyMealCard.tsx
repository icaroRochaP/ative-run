'use client'

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { MealPlan } from "@/types/nutrition"
import { cn } from "@/lib/utils"
import { useMealConsumption } from "@/hooks/nutrition/useMealConsumptionGlobal"

interface WeeklyMealCardProps {
  meal: MealPlan
  onClick?: (meal: MealPlan) => void
  className?: string
  selectedDate: string // Adicionar data para o hook de consumo
}

export function WeeklyMealCard({ meal, onClick, className, selectedDate }: WeeklyMealCardProps) {
  const { isMealConsumed } = useMealConsumption(selectedDate)
  const isConsumed = isMealConsumed(meal.recipe.id)

  const handleCardClick = () => {
    onClick?.(meal)
  }

  // Estilos condicionais baseados no estado de consumo (similar ao MealCard principal)
  const cardStyles = cn(
    "border cursor-pointer transition-all duration-300 hover:shadow-lg rounded-2xl mx-4 mb-3 relative overflow-hidden hover:border-gray-300",
    isConsumed 
      ? "bg-gradient-to-r from-emerald-50 to-emerald-100 border-2 border-emerald-200 shadow-lg" 
      : "border-gray-200 bg-white",
    className
  )

  return (
    <Card 
      className={cardStyles}
      onClick={handleCardClick}
    >
      <CardContent className="p-5">
        {/* Badge de Consumo no Canto Superior Direito */}
        {isConsumed && (
          <div className="absolute top-3 right-3 bg-emerald-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold shadow-lg">
            ✓
          </div>
        )}

        {/* Header com nome da refeição e badge de calorias */}
        <div className="flex justify-between items-center mb-4">
          <h4 className={cn(
            "font-bold text-lg",
            isConsumed ? "text-emerald-800" : "text-slate-900"
          )}>
            {meal.mealType}
          </h4>
          <Badge className={cn(
            "border-0 rounded-xl px-3 py-1 font-medium",
            isConsumed 
              ? "bg-emerald-600 text-white" 
              : "bg-aleen-primary text-white"
          )}>
            {meal.nutrition.calories} cal
          </Badge>
        </div>

        {/* Grade de macronutrientes */}
        <div className="grid grid-cols-3 gap-4 mb-3">
          <div className="text-center">
            <div className={cn(
              "text-sm font-medium mb-1",
              isConsumed ? "text-emerald-600" : "text-aleen-primary"
            )}>
              P
            </div>
            <div className={cn(
              "font-bold text-base",
              isConsumed ? "text-emerald-800" : "text-slate-900"
            )}>
              {meal.nutrition.protein}g
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-sm font-medium mb-1",
              isConsumed ? "text-emerald-600" : "text-blue-500"
            )}>
              C
            </div>
            <div className={cn(
              "font-bold text-base",
              isConsumed ? "text-emerald-800" : "text-slate-900"
            )}>
              {meal.nutrition.carbs}g
            </div>
          </div>
          <div className="text-center">
            <div className={cn(
              "text-sm font-medium mb-1",
              isConsumed ? "text-emerald-600" : "text-purple-500"
            )}>
              G
            </div>
            <div className={cn(
              "font-bold text-base",
              isConsumed ? "text-emerald-800" : "text-slate-900"
            )}>
              {meal.nutrition.fat}g
            </div>
          </div>
        </div>

        {/* Footer apenas com texto */}
        <div className="flex items-center justify-center">
          <div className={cn(
            "text-sm font-medium",
            isConsumed ? "text-emerald-600" : "text-gray-600"
          )}>
            Clique para ver detalhes
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
