import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { MacroGoalsCard } from "@/components/dashboard/cards/MacroGoalsCard"
import { MealCard } from "@/components/dashboard/cards/MealCard"
import { NutricaoTabProps } from "@/types/dashboard"

export function NutricaoTab({
  dailyCalories,
  protein,
  carbs,
  fat,
  todayMeals,
  onMealSelect,
  onShowWeeklyPlan,
}: NutricaoTabProps) {
  return (
    <div className="space-y-6">
      {/* Daily Macro Goals */}
      <MacroGoalsCard
        calories={dailyCalories}
        protein={protein}
        carbs={carbs}
        fat={fat}
      />

      {/* Today's Meal Plan */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-gray-800 font-bold text-xl mb-4">Plano de Refeições de Hoje</h2>
          {todayMeals.map((meal, index) => (
            <MealCard
              key={index}
              meal={meal}
              onClick={onMealSelect}
            />
          ))}
          <Button
            className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold py-3 mt-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={onShowWeeklyPlan}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Plano Semanal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
