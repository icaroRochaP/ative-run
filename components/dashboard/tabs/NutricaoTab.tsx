'use client'

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar, Loader2, AlertCircle } from "lucide-react"
import { MacroGoalsCard } from "@/components/dashboard/cards/MacroGoalsCard"
import { MealCard } from "@/components/dashboard/cards/MealCard"
import { DaySelectorCard } from "@/components/nutrition/DaySelectorCard"
import { useWeeklyMealPlan } from "@/hooks/nutrition/useWeeklyMealPlan"
import { NutricaoTabProps } from "@/types/dashboard"

interface ExtendedNutricaoTabProps extends NutricaoTabProps {
  userId: string
  loading?: boolean
  error?: string | null
  hasNoMealPlan?: boolean
}

export function NutricaoTab({
  userId,
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
  // Estado para navegação por dias
  const [isWeeklyPlanOpen, setIsWeeklyPlanOpen] = useState(true)
  
  // Hook para dados do plano semanal
  const {
    weeklyPlan,
    selectedDay,
    selectedDayData,
    isLoading: weeklyPlanLoading,
    error: weeklyPlanError,
    setSelectedDay,
    refreshData
  } = useWeeklyMealPlan({
    userId,
    isOpen: isWeeklyPlanOpen
  })

  // Definir dia atual como padrão
  const getCurrentDay = useCallback(() => {
    const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return dayMapping[new Date().getDay()]
  }, [])

  // Função para obter nome em português do dia
  const getDayDisplayName = useCallback((day: string) => {
    const dayNames: Record<string, string> = {
      monday: 'Segunda-feira',
      tuesday: 'Terça-feira',
      wednesday: 'Quarta-feira',
      thursday: 'Quinta-feira',
      friday: 'Sexta-feira',
      saturday: 'Sábado',
      sunday: 'Domingo'
    }
    return dayNames[day] || day
  }, [])

  // Inicializar com o dia atual quando o plano for carregado
  useEffect(() => {
    if (weeklyPlan && !selectedDay) {
      const today = getCurrentDay()
      const availableDays = Object.keys(weeklyPlan.days)
      setSelectedDay(availableDays.includes(today) ? today : availableDays[0] || 'monday')
    }
  }, [weeklyPlan, selectedDay, getCurrentDay, setSelectedDay])

  // Determinar que dados exibir - dados do dia selecionado ou dados padrão
  const displayData = selectedDayData ? {
    totalCalories: selectedDayData.totalCalories,
    totalProtein: selectedDayData.totalProtein,
    totalCarbs: selectedDayData.totalCarbs,
    totalFat: selectedDayData.totalFat,
    meals: selectedDayData.meals.map(mealPlan => ({
      meal: mealPlan.mealType,
      calories: mealPlan.nutrition.calories,
      protein: mealPlan.nutrition.protein.toString(),
      carbs: mealPlan.nutrition.carbs.toString(),
      fat: mealPlan.nutrition.fat.toString(),
      foods: [mealPlan.recipe.name],
      recipeId: mealPlan.recipe.id,
      recipeName: mealPlan.recipe.name,
      recipeDescription: mealPlan.recipe.description,
      isConsumed: mealPlan.isConsumed,
    }))
  } : {
    totalCalories: dailyCalories,
    totalProtein: protein,
    totalCarbs: carbs,
    totalFat: fat,
    meals: todayMeals || []
  }

  // Obter dias disponíveis para o selector - sempre mostrar dias padrão durante carregamento
  const defaultDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday']
  const availableDays = weeklyPlan ? Object.keys(weeklyPlan.days) : defaultDays

  // Handler para seleção de dia
  const handleDaySelect = (day: string) => {
    // Só permitir seleção se os dados estiverem carregados
    if (weeklyPlan && Object.keys(weeklyPlan.days).includes(day)) {
      setSelectedDay(day)
    }
  }

  // Handler para abrir plano semanal
  const handleShowWeeklyPlan = () => {
    if (onShowWeeklyPlan) {
      onShowWeeklyPlan()
    }
  }
  // Loading state
  if (loading || weeklyPlanLoading) {
    return (
      <div className="space-y-6">
        {/* Day Selector Card - sempre visível */}
        <DaySelectorCard
          selectedDay={selectedDay || getCurrentDay()}
          onDaySelect={handleDaySelect}
          availableDays={availableDays}
          isLoading={true}
        />

        {/* Daily Macro Goals */}
        <MacroGoalsCard
          calories={displayData.totalCalories}
          protein={displayData.totalProtein}
          carbs={displayData.totalCarbs}
          fat={displayData.totalFat}
        />

        {/* Loading Meal Plan */}
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-gray-800 font-bold text-xl mb-4">
              {selectedDayData ? `Refeições de ${getDayDisplayName(selectedDay)}` : 'Plano de Refeições de Hoje'}
            </h2>
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
  if (error || weeklyPlanError) {
    return (
      <div className="space-y-6">
        {/* Day Selector Card - sempre visível */}
        <DaySelectorCard
          selectedDay={selectedDay || getCurrentDay()}
          onDaySelect={handleDaySelect}
          availableDays={availableDays}
          isLoading={false}
        />

        {/* Daily Macro Goals */}
        <MacroGoalsCard
          calories={displayData.totalCalories}
          protein={displayData.totalProtein}
          carbs={displayData.totalCarbs}
          fat={displayData.totalFat}
        />

        {/* Error Meal Plan */}
        <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
          <CardContent className="space-y-4 p-6">
            <h2 className="text-gray-800 font-bold text-xl mb-4">
              {selectedDayData ? `Refeições de ${getDayDisplayName(selectedDay)}` : 'Plano de Refeições de Hoje'}
            </h2>
            <div className="flex items-center justify-center py-8 text-red-600">
              <AlertCircle className="h-8 w-8" />
              <div className="ml-2">
                <p className="font-medium">Erro ao carregar refeições</p>
                <p className="text-sm text-gray-600">{error || weeklyPlanError}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // No meal plan state
  if (hasNoMealPlan && !weeklyPlan) {
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
                onClick={handleShowWeeklyPlan}
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
      {/* Day Selector Card - sempre visível */}
      <DaySelectorCard
        selectedDay={selectedDay || getCurrentDay()}
        onDaySelect={handleDaySelect}
        availableDays={availableDays}
        isLoading={false}
      />

      {/* Daily Macro Goals */}
      <MacroGoalsCard
        calories={displayData.totalCalories}
        protein={displayData.totalProtein}
        carbs={displayData.totalCarbs}
        fat={displayData.totalFat}
      />

      {/* Today's Meal Plan */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="space-y-4 p-6">
          <h2 className="text-gray-800 font-bold text-xl mb-4">
            {selectedDayData ? `Refeições de ${getDayDisplayName(selectedDay)}` : 'Plano de Refeições de Hoje'}
          </h2>
          {displayData.meals.map((meal, index) => (
            <MealCard
              key={`meal-${('recipeId' in meal && meal.recipeId) || 'unknown'}-${index}`}
              meal={meal}
              onClick={onMealSelect}
              onConsumptionToggle={onConsumptionToggle}
            />
          ))}
          <Button
            className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-semibold py-3 mt-4 rounded-2xl transition-all duration-300 shadow-lg hover:shadow-xl"
            onClick={handleShowWeeklyPlan}
          >
            <Calendar className="h-4 w-4 mr-1" />
            Plano Semanal
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
