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

// Consumption API Types
export interface ConsumeRequest {
  recipeId: string
  consumedAt?: string // Default: today
}

export interface ConsumeResponse {
  success: boolean
  logId?: string
  consumedAt: string
  message?: string
}

export interface UnconsumeRequest {
  recipeId: string
  consumedAt?: string // Default: today
}

export interface UnconsumeResponse {
  success: boolean
  removed: boolean
}

export interface ConsumptionStatusRequest {
  date?: string // Default: today
}

export interface ConsumptionStatusResponse {
  success: boolean
  consumedRecipes: Array<{
    recipeId: string
    logId: string
    consumedAt: string
  }>
  error?: string
}

// Meal Consumption Status for UI
export interface MealConsumptionStatus {
  isConsumed: boolean
  consumedAt?: Date
  logId?: string
}

// Weekly Meal Plan Types - New Implementation
export interface WeeklyMealPlan {
  userId: string
  planId: string
  planName: string
  days: {
    [key: string]: DayMealPlan // 'monday', 'tuesday', etc.
  }
}

export interface DayMealPlan {
  dayName: string
  dayOfWeek: string // 'segunda-feira', 'terça-feira'
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  meals: MealPlan[]
}

export interface MealPlan {
  id: string
  mealType: string // 'Café da Manhã', 'Almoço', etc.
  recipe: {
    id: string
    name: string
    description?: string
  }
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
  displayOrder: number
  isConsumed?: boolean
}

// API Response types for Weekly Plan
export interface WeeklyPlanResponse {
  success: boolean
  data?: WeeklyMealPlan
  error?: string
  meta?: {
    totalDays: number
    totalMeals: number
    avgCaloriesPerDay: number
  }
}