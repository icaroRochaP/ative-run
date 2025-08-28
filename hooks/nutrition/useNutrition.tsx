"use client"

import { useDayMeals } from '@/hooks/nutrition/useDayMeals'
import { useMealConsumption } from '@/hooks/nutrition/useMealConsumptionGlobal'

export function useNutrition() {
  const { data: dailyMealPlan, loading, error } = useDayMeals()
  
  // Get current date for meal consumption tracking
  const currentDate = new Date().toISOString().split('T')[0]
  
  // Use global singleton for meal consumption state
  const { 
    consumedMeals, 
    loading: consumptionLoading, 
    error: consumptionError,
    consumeMeal,
    unConsumeMeal,
    isMealConsumed
  } = useMealConsumption(currentDate)

  // Convert our data to match the existing component interface
  const getTodayMeals = () => {
    if (!dailyMealPlan) return []

    return dailyMealPlan.meals.map(meal => ({
      meal: getMealTypeDisplay(meal.meal_type),
      calories: meal.nutrition.calories,
      protein: `${meal.nutrition.protein}g`,
      carbs: `${meal.nutrition.carbs}g`,
      fat: `${meal.nutrition.fat}g`,
      foods: [meal.recipe.name], // For now, just show recipe name
      // Add recipe details for enhanced modal
      recipeId: meal.recipe.id,
      recipeName: meal.recipe.name,
      recipeDescription: meal.recipe.description,
      recipeImageUrl: meal.recipe.image_url,
      // Add consumption tracking
      isConsumed: isMealConsumed(meal.recipe.id),
      isConsumptionLoading: false // Global singleton doesn't track per-meal loading
    }))
  }

  const getDailyNutrition = () => {
    if (!dailyMealPlan) {
      return {
        calories: 0,
        protein: 0,
        carbs: 0,
        fat: 0,
      }
    }

    return {
      calories: dailyMealPlan.total_nutrition.calories,
      protein: Math.round(dailyMealPlan.total_nutrition.protein),
      carbs: Math.round(dailyMealPlan.total_nutrition.carbs),
      fat: Math.round(dailyMealPlan.total_nutrition.fat),
    }
  }

  const getMealTypeDisplay = (mealType: string): string => {
    const mealTypeMap: { [key: string]: string } = {
      'café da manhã': 'Café da Manhã',
      'almoço': 'Almoço', 
      'jantar': 'Jantar',
      'lanche da tarde': 'Lanche da Tarde',
      'lanche': 'Lanche',
      'breakfast': 'Café da Manhã',
      'lunch': 'Almoço',
      'dinner': 'Jantar',
      'snack': 'Lanche',
    }
    return mealTypeMap[mealType.toLowerCase()] || mealType
  }

  // Handler para toggle de consumo
  const handleConsumptionToggle = async (meal: any) => {
    if (meal.recipeId) {
      try {
        if (isMealConsumed(meal.recipeId)) {
          await unConsumeMeal(meal.recipeId)
        } else {
          await consumeMeal(meal.recipeId)
        }
      } catch (error) {
        console.error('Error toggling consumption:', error)
      }
    }
  }

  const hasNoMealPlan = !loading && !error && (!dailyMealPlan || dailyMealPlan.meals.length === 0)

  return {
    dailyMealPlan,
    todayMeals: getTodayMeals(),
    dailyNutrition: getDailyNutrition(),
    // Don't block on consumption loading - only block on main meal data
    loading: loading,
    error: error || consumptionError,
    hasNoMealPlan,
    refetch: () => window.location.reload(),
    // Consumption methods
    handleConsumptionToggle,
    consumedMeals,
    consumptionLoading
  }
}