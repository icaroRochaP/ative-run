"use client"

import { useDayMeals } from '@/hooks/nutrition/useDayMeals'

export function useNutrition() {
  const { data: dailyMealPlan, loading, error } = useDayMeals()

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
      recipeImageUrl: meal.recipe.image_url
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

  const hasNoMealPlan = !loading && !error && (!dailyMealPlan || dailyMealPlan.meals.length === 0)

  return {
    dailyMealPlan,
    todayMeals: getTodayMeals(),
    dailyNutrition: getDailyNutrition(),
    loading,
    error,
    hasNoMealPlan,
    refetch: () => window.location.reload(),
  }
}