// Nutrition Types - Based on existing database tables

export interface Food {
  id: string
  name: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
  created_at: string
}

export interface Recipe {
  id: string
  name: string
  description?: string
  image_url?: string
  created_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  food_id: string
  quantity_in_grams: number
  display_unit?: string
  food?: Food
}

export interface UserMealPlan {
  id: string
  user_id: string
  name: string
  start_date: string
  end_date?: string
  is_active: boolean
  created_at: string
}

export interface PlanMeal {
  id: string
  user_meal_plan_id: string
  day_of_week: string
  meal_type: string
  recipe_id: string
  display_order: number
  recipe?: Recipe
}

export interface MealConsumptionLog {
  id: string
  user_id: string
  recipe_id: string
  consumed_at: string
  recipe?: Recipe
}

// Calculated nutrition info for a recipe
export interface RecipeNutrition {
  calories: number
  protein: number
  carbs: number
  fat: number
}

// Daily meal plan with nutrition info
export interface DailyMealPlan {
  day_of_week: string
  meals: Array<{
    meal_type: string
    recipe: Recipe
    nutrition: RecipeNutrition
    display_order: number
  }>
  total_nutrition: RecipeNutrition
}

// API Response types
export interface DayMealsResponse {
  success: boolean
  data?: DailyMealPlan
  error?: string
}

export interface UserPlanResponse {
  success: boolean
  data?: UserMealPlan
  error?: string
}

export interface RecipeWithNutritionResponse {
  success: boolean
  data?: Recipe & { nutrition: RecipeNutrition; ingredients: Array<RecipeIngredient & { food: Food }> }
  error?: string
}