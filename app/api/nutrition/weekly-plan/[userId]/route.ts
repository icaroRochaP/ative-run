import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { WeeklyMealPlan, DayMealPlan, MealPlan, WeeklyPlanResponse, RecipeNutrition } from '@/types/nutrition'

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

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } }
) {
  try {
    const supabase = createAdminClient()
    const { userId } = await params

    if (!userId) {
      return NextResponse.json({
        success: false,
        error: 'User ID is required'
      }, { status: 400 })
    }

    console.log('🔍 Weekly Plan API: Starting for userId:', userId)

    // Buscar primeiro o plano ativo do usuário
    const { data: userPlan, error: planError } = await supabase
      .from('user_meal_plans')
      .select('id, name')
      .eq('user_id', userId)
      .eq('is_active', true)
      .maybeSingle()

    console.log('🔍 User plan query result:', { userPlan, planError })

    if (planError) {
      console.error('Error fetching user plan:', planError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch user meal plan'
      }, { status: 500 })
    }

    if (!userPlan) {
      console.log('❌ No active plan found for user:', userId)
      return NextResponse.json({
        success: false,
        error: 'No active meal plan found for user'
      }, { status: 404 })
    }

    console.log('✅ Found user plan:', userPlan)

    // Buscar as refeições do plano com receitas e calcular nutrição real
    const { data: planMeals, error: mealsError } = await supabase
      .from('plan_meals')
      .select(`
        day_of_week,
        meal_type,
        display_order,
        recipe:recipes (
          id,
          name,
          description
        )
      `)
      .eq('user_meal_plan_id', userPlan.id)
      .order('display_order')

    if (mealsError) {
      console.error('Error fetching plan meals:', mealsError)
      return NextResponse.json({
        success: false,
        error: 'Failed to fetch meal plan details'
      }, { status: 500 })
    }

    if (!planMeals || planMeals.length === 0) {
      return NextResponse.json({
        success: false,
        error: 'No meals found in meal plan'
      }, { status: 404 })
    }

    // Calcular nutrição real para cada receita
    const mealsWithNutrition = await Promise.all(
      planMeals.map(async (meal: any) => {
        const nutrition = await calculateRecipeNutrition(supabase, meal.recipe.id)
        return {
          ...meal,
          recipe: {
            ...meal.recipe,
            nutrition
          }
        }
      })
    )

    const rawData = {
      id: userPlan.id,
      name: userPlan.name,
      plan_meals: mealsWithNutrition
    }

    // Transformar dados do banco em estrutura do frontend
    const weeklyPlan = transformSupabaseDataToWeeklyPlan(rawData, userId)

    const response: WeeklyPlanResponse = {
      success: true,
      data: weeklyPlan,
      meta: {
        totalDays: Object.keys(weeklyPlan.days).length,
        totalMeals: Object.values(weeklyPlan.days).reduce((sum, day) => sum + day.meals.length, 0),
        avgCaloriesPerDay: Math.round(
          Object.values(weeklyPlan.days).reduce((sum, day) => sum + day.totalCalories, 0) / 
          Object.keys(weeklyPlan.days).length
        )
      }
    }

    return NextResponse.json(response)

  } catch (error) {
    console.error('API error in weekly-plan:', error)
    return NextResponse.json({
      success: false,
      error: 'Internal server error'
    }, { status: 500 })
  }
}

function transformSupabaseDataToWeeklyPlan(rawData: any, userId: string): WeeklyMealPlan {
  // Mapear dias da semana em português para inglês para organização
  const dayMapping: Record<string, string> = {
    'segunda-feira': 'monday',
    'terça-feira': 'tuesday', 
    'quarta-feira': 'wednesday',
    'quinta-feira': 'thursday',
    'sexta-feira': 'friday',
    'sábado': 'saturday',
    'domingo': 'sunday'
  }

  const days: Record<string, DayMealPlan> = {}
  
  const planId = rawData.id
  const planName = rawData.name || 'Plano Semanal'

  // Agrupar por dia da semana
  rawData.plan_meals.forEach((planMeal: any) => {
    const dayKey = dayMapping[planMeal.day_of_week] || planMeal.day_of_week
    const dayName = planMeal.day_of_week

    if (!days[dayKey]) {
      days[dayKey] = {
        dayName: dayName,
        dayOfWeek: dayName,
        totalCalories: 0,
        totalProtein: 0,
        totalCarbs: 0,
        totalFat: 0,
        meals: []
      }
    }

    // Usar a nutrição real calculada da receita
    const recipe = planMeal.recipe
    const nutrition = recipe.nutrition || { calories: 0, protein: 0, carbs: 0, fat: 0 }

    // Adicionar refeição
    const meal: MealPlan = {
      id: recipe?.id || '',
      mealType: planMeal.meal_type,
      recipe: {
        id: recipe?.id || '',
        name: recipe?.name || 'Refeição sem nome',
        description: recipe?.description
      },
      nutrition: {
        calories: nutrition.calories,
        protein: nutrition.protein,
        carbs: nutrition.carbs,
        fat: nutrition.fat
      },
      displayOrder: planMeal.display_order || 0
    }

    days[dayKey].meals.push(meal)

    // Somar para totais do dia
    days[dayKey].totalCalories += meal.nutrition.calories
    days[dayKey].totalProtein += meal.nutrition.protein
    days[dayKey].totalCarbs += meal.nutrition.carbs
    days[dayKey].totalFat += meal.nutrition.fat
  })

  // Ordenar refeições por display_order
  Object.keys(days).forEach(dayKey => {
    days[dayKey].meals.sort((a, b) => a.displayOrder - b.displayOrder)
    
    // Arredondar totais
    days[dayKey].totalCalories = Math.round(days[dayKey].totalCalories)
    days[dayKey].totalProtein = Math.round(days[dayKey].totalProtein * 10) / 10
    days[dayKey].totalCarbs = Math.round(days[dayKey].totalCarbs * 10) / 10
    days[dayKey].totalFat = Math.round(days[dayKey].totalFat * 10) / 10
  })

  return {
    userId,
    planId,
    planName,
    days
  }
}
