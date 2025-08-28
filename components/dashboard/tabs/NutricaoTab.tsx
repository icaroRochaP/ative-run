import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Loader2, AlertCircle } from "lucide-react"
import { MacroGoalsCard } from "@/components/dashboard/cards/MacroGoalsCard"
import { MealCard } from "@/components/dashboard/cards/MealCard"
import { NutricaoTabProps } from "@/types/dashboard"

interface ExtendedNutricaoTabProps extends NutricaoTabProps {
  loading?: boolean
  error?: string | null
  hasNoMealPlan?: boolean
}

export function NutricaoTab({
  dailyCalories,
  protein,
  carbs,
  fat,
  todayMeals,
  onMealSelect,
  onShowWeeklyPlan,
  onConsumptionToggle,
  loading = false,
  error = null,
  hasNoMealPlan = false,
}: ExtendedNutricaoTabProps) {
  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        {/* Daily Macro Goals */}
        <MacroGoalsCard
          calories={dailyCalories}
          protein={protein}
          carbs={carbs}
          fat={fat}
        />

        {/* Loading Meal Plan */}
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-gray-800 font-bold text-xl mb-4">Plano de Refeições de Hoje</h2>
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-aleen-primary" />
              <span className="ml-2 text-gray-600">Carregando suas refeições...</span>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        {/* Daily Macro Goals */}
        <MacroGoalsCard
          calories={dailyCalories}
          protein={protein}
          carbs={carbs}
          fat={fat}
        />

        {/* Error Meal Plan */}
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-gray-800 font-bold text-xl mb-4">Plano de Refeições de Hoje</h2>
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="h-8 w-8" />
              <div className="ml-2">
                <p className="font-medium">Erro ao carregar refeições</p>
                <p className="text-sm text-gray-600">{error}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No meal plan state
  if (hasNoMealPlan) {
    return (
      <div className="space-y-6">
        {/* Daily Macro Goals */}
        <MacroGoalsCard
          calories={dailyCalories}
          protein={protein}
          carbs={carbs}
          fat={fat}
        />

        {/* No Meal Plan */}
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-gray-800 font-bold text-xl mb-4">Plano de Refeições de Hoje</h2>
            <div className="text-center py-8">
              <div className="text-gray-400 mb-4">
                <Calendar className="h-16 w-16 mx-auto mb-4" />
              </div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                Você ainda não tem um plano de refeições para hoje
              </h3>
              <p className="text-gray-600 mb-6">
                Monte seu plano semanal para começar a acompanhar suas refeições
              </p>
              <Button
                className="bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
                onClick={onShowWeeklyPlan}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Criar Plano Semanal
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Success state with meals
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
              onConsumptionToggle={onConsumptionToggle}
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
