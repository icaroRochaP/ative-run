"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2, AlertCircle } from "lucide-react"
import { WeeklyMealPlanModalProps } from "@/types/dashboard"
import { useWeeklyMealPlan } from "@/hooks/nutrition/useWeeklyMealPlan"
import { DaySelector } from "@/components/nutrition/DaySelector"
import { DaySummaryCard } from "@/components/nutrition/DaySummaryCard"
import { WeeklyMealCard } from "@/components/nutrition/WeeklyMealCard"
import { MealPlan } from "@/types/nutrition"

interface ExtendedWeeklyMealPlanModalProps extends Omit<WeeklyMealPlanModalProps, 'mealPlan'> {
  userId: string
}

export function WeeklyMealPlanModal({ 
  isOpen, 
  onClose, 
  onMealSelect, 
  userId 
}: ExtendedWeeklyMealPlanModalProps) {
  const {
    weeklyPlan,
    selectedDay,
    selectedDayData,
    isLoading,
    error,
    setSelectedDay,
    refreshData
  } = useWeeklyMealPlan({ userId, isOpen })

  if (!isOpen) return null

  // Função para converter selectedDay em data atual
  const getDateForSelectedDay = (dayKey: string): string => {
    const dayMapping: Record<string, number> = {
      'sunday': 0,
      'monday': 1,
      'tuesday': 2,
      'wednesday': 3,
      'thursday': 4,
      'friday': 5,
      'saturday': 6
    }

    const today = new Date()
    const currentDayOfWeek = today.getDay()
    const targetDayOfWeek = dayMapping[dayKey]
    
    if (targetDayOfWeek === undefined) {
      // Se não encontrar o dia, usa hoje
      return today.toISOString().split('T')[0]
    }

    // Calcular diferença de dias
    let daysToAdd = targetDayOfWeek - currentDayOfWeek
    
    // Se o dia for anterior na semana, assumir próxima semana
    if (daysToAdd < 0) {
      daysToAdd += 7
    }

    const targetDate = new Date(today)
    targetDate.setDate(today.getDate() + daysToAdd)
    
    return targetDate.toISOString().split('T')[0]
  }

  const selectedDateForConsumption = selectedDay ? getDateForSelectedDay(selectedDay) : new Date().toISOString().split('T')[0]

  const handleMealSelect = (meal: MealPlan) => {
    // Converter MealPlan para o formato esperado pelo onMealSelect
    const mealData = {
      meal: meal.mealType,
      calories: meal.nutrition.calories,
      protein: `${meal.nutrition.protein}g`,
      carbs: `${meal.nutrition.carbs}g`,
      fat: `${meal.nutrition.fat}g`,
      foods: [meal.recipe.name], // Usar nome da receita como food
      recipeId: meal.recipe.id,
      recipeName: meal.recipe.name,
      recipeDescription: meal.recipe.description
    }
    onMealSelect?.(mealData)
    onClose()
  }

  const availableDays = weeklyPlan ? Object.keys(weeklyPlan.days) : []

  return (
    <div className="fixed inset-0 bg-black/50 flex items-start justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-lg bg-white border-0 shadow-2xl rounded-3xl my-8 max-h-[95vh] overflow-hidden">
        {/* Header */}
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl sticky top-0 z-10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white text-xl font-bold">
              Plano Semanal de Refeições
            </CardTitle>
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

        <CardContent className="p-0 flex flex-col h-full max-h-[calc(95vh-120px)]">
          {/* Loading State */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <Loader2 className="h-8 w-8 animate-spin text-aleen-primary mb-3" />
              <span className="text-gray-600 font-medium">Carregando plano semanal...</span>
            </div>
          )}

          {/* Error State */}
          {error && !isLoading && (
            <div className="flex flex-col items-center justify-center py-12 px-6">
              <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Erro ao carregar plano
              </h3>
              <p className="text-gray-600 text-center mb-4">
                {error}
              </p>
              <Button
                onClick={refreshData}
                variant="outline"
                className="border-aleen-primary text-aleen-primary hover:bg-aleen-primary hover:text-white"
              >
                Tentar novamente
              </Button>
            </div>
          )}

          {/* Success State */}
          {weeklyPlan && !isLoading && !error && (
            <>
              {/* Day Selector - Sticky */}
              <div className="sticky top-0 bg-white border-b border-gray-100 z-10">
                <DaySelector
                  selectedDay={selectedDay}
                  onDaySelect={setSelectedDay}
                  availableDays={availableDays}
                />
              </div>

              {/* Scrollable Content */}
              <div className="flex-1 overflow-y-auto">
                {/* Selected Day Content */}
                {selectedDayData && (
                  <div className="pb-6">
                    {/* Day Title */}
                    <div className="px-4 pt-4 pb-2">
                      <h3 className="text-2xl font-bold text-center text-gray-800">
                        {selectedDayData.dayName.charAt(0).toUpperCase() + selectedDayData.dayName.slice(1)}
                      </h3>
                    </div>

                    {/* Day Summary Card */}
                    <div className="px-4">
                      <DaySummaryCard dayData={selectedDayData} />
                    </div>

                    {/* Meals for Selected Day */}
                    <div className="px-4 space-y-2 mt-4">
                      {selectedDayData.meals.map((meal, index) => (
                        <WeeklyMealCard
                          key={`${meal.id}-${index}`}
                          meal={meal}
                          onClick={handleMealSelect}
                          selectedDate={selectedDateForConsumption}
                        />
                      ))}
                    </div>

                    {/* Empty State for Day with No Meals */}
                    {selectedDayData.meals.length === 0 && (
                      <div className="text-center py-8 px-6">
                        <div className="text-gray-400 mb-2 text-4xl">
                          🍽️
                        </div>
                        <p className="text-gray-600">
                          Nenhuma refeição planejada para este dia
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Empty State for No Day Selected */}
                {!selectedDayData && availableDays.length > 0 && (
                  <div className="text-center py-8 px-6">
                    <div className="text-gray-400 mb-2 text-4xl">
                      📅
                    </div>
                    <p className="text-gray-600">
                      Selecione um dia para ver as refeições
                    </p>
                  </div>
                )}
              </div>
            </>
          )}

          {/* No Plan State */}
          {!weeklyPlan && !isLoading && !error && (
            <div className="text-center py-12 px-6">
              <div className="text-gray-400 mb-4 text-5xl">
                📅
              </div>
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Nenhum plano encontrado
              </h3>
              <p className="text-gray-600">
                Você ainda não possui um plano semanal ativo
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
