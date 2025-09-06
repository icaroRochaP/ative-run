"use client"

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { DailyMealPlan, RecipeNutrition } from '@/types/nutrition'

// Helper function to calculate nutrition from recipe ingredients
async function calculateRecipeNutrition(supabase: any, recipeId: string): Promise<RecipeNutrition> {
  const { data: ingredients, error } = await supabase
    .from('recipe_ingredients')
    .select(`
      quantity_in_grams,
      food:foods(
        calories_per_100g,
        protein_per_100g,
        carbs_per_100g,
        fat_per_100g
      )
    `)
    .eq('recipe_id', recipeId)

  if (error || !ingredients) {
    console.error('Error fetching recipe ingredients:', error)
    return { calories: 0, protein: 0, carbs: 0, fat: 0 }
  }

  let totalCalories = 0
  let totalProtein = 0
  let totalCarbs = 0
  let totalFat = 0

  ingredients.forEach((ingredient: any) => {
    const { quantity_in_grams, food } = ingredient
    if (food) {
      // Calculate nutrition based on quantity (food values are per 100g)
      const factor = quantity_in_grams / 100
      totalCalories += food.calories_per_100g * factor
      totalProtein += food.protein_per_100g * factor
      totalCarbs += food.carbs_per_100g * factor
      totalFat += food.fat_per_100g * factor
    }
  })

  return {
    calories: Math.round(totalCalories),
    protein: Math.round(totalProtein * 10) / 10,
    carbs: Math.round(totalCarbs * 10) / 10,
    fat: Math.round(totalFat * 10) / 10
  }
}

// Helper function to get Portuguese day of week
function getCurrentDayOfWeek(): string {
  const days = [
    'domingo', 'segunda-feira', 'terça-feira', 'quarta-feira', 
    'quinta-feira', 'sexta-feira', 'sábado'
  ]
  const today = new Date()
  return days[today.getDay()]
}

export function useDayMeals() {
  const [data, setData] = useState<DailyMealPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDayMeals() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 useDayMeals: Starting fetch...')
        
        const supabase = getSupabaseClient()
        
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser()
        console.log('🔍 useDayMeals: User check result:', { user: user?.id, error: userError?.message })
        
        if (userError || !user) {
          console.log('❌ useDayMeals: User not authenticated')
          setError('User not authenticated')
          setLoading(false)
          return
        }

        console.log('✅ useDayMeals: User authenticated:', user.id)

        // Get current day of week
        const currentDay = getCurrentDayOfWeek()
        console.log('📅 useDayMeals: Current day:', currentDay)

        // First, find the active meal plan for the user
        const { data: activePlan, error: planError } = await supabase
          .from('user_meal_plans')
          .select('id')
          .eq('user_id', user.id)
          .eq('is_active', true)
          .single()

        console.log('🔍 useDayMeals: Active plan result:', { plan: activePlan?.id, error: planError?.message })

        if (planError || !activePlan) {
          console.log('ℹ️ useDayMeals: No active plan found, returning empty meals')
          setData({
            day_of_week: currentDay,
            meals: [],
            total_nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
          })
          setLoading(false)
          return
        }

        console.log('✅ useDayMeals: Found active plan:', (activePlan as any).id)

        // Get today's meals from plan_meals
        const { data: planMeals, error: mealsError } = await supabase
          .from('plan_meals')
          .select(`
            meal_type,
            display_order,
            recipe:recipes(
              id,
              name,
              description,
              image_url
            )
          `)
          .eq('user_meal_plan_id', (activePlan as any).id)
          .eq('day_of_week', currentDay)
          .order('display_order', { ascending: true })

        console.log('🔍 useDayMeals: Plan meals result:', { 
          mealsCount: planMeals?.length || 0, 
          error: mealsError?.message 
        })

        if (mealsError) {
          console.error('❌ useDayMeals: Error fetching plan meals:', mealsError)
          setError('Failed to fetch meal plan')
          setLoading(false)
          return
        }

        if (!planMeals || planMeals.length === 0) {
          console.log('ℹ️ useDayMeals: No meals found for today, returning empty meals')
          setData({
            day_of_week: currentDay,
            meals: [],
            total_nutrition: { calories: 0, protein: 0, carbs: 0, fat: 0 }
          })
          setLoading(false)
          return
        }

        console.log('✅ useDayMeals: Found meals for today:', planMeals.length)

        // Calculate nutrition for each recipe
        const mealsWithNutrition = await Promise.all(
          planMeals.map(async (meal: any) => {
            console.log('🥗 useDayMeals: Calculating nutrition for recipe:', meal.recipe.name)
            const nutrition = await calculateRecipeNutrition(supabase, meal.recipe.id)
            return {
              meal_type: meal.meal_type,
              recipe: meal.recipe,
              nutrition,
              display_order: meal.display_order
            }
          })
        )

        console.log('✅ useDayMeals: Nutrition calculated for all meals')

        // Calculate total daily nutrition
        const totalNutrition = mealsWithNutrition.reduce(
          (total: RecipeNutrition, meal: any) => ({
            calories: total.calories + meal.nutrition.calories,
            protein: total.protein + meal.nutrition.protein,
            carbs: total.carbs + meal.nutrition.carbs,
            fat: total.fat + meal.nutrition.fat
          }),
          { calories: 0, protein: 0, carbs: 0, fat: 0 }
        )

        const result: DailyMealPlan = {
          day_of_week: currentDay,
          meals: mealsWithNutrition,
          total_nutrition: {
            calories: Math.round(totalNutrition.calories),
            protein: Math.round(totalNutrition.protein * 10) / 10,
            carbs: Math.round(totalNutrition.carbs * 10) / 10,
            fat: Math.round(totalNutrition.fat * 10) / 10
          }
        }

        console.log('🎉 useDayMeals: Returning successful result with', mealsWithNutrition.length, 'meals')
        setData(result)
        setLoading(false)

      } catch (error) {
        console.error('💥 useDayMeals: Unexpected error:', error)
        setError('Internal error')
        setLoading(false)
      }
    }

    fetchDayMeals()
  }, [])

  return { data, loading, error, refetch: () => window.location.reload() }
}
