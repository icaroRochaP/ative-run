"use client"

import { useState, useEffect } from 'react'
import { getSupabaseClient } from '@/lib/supabase'

export interface RecipeIngredient {
  display_unit: string
  quantity_in_grams: number
  food_name: string
  calories_per_100g: number
  protein_per_100g: number
  carbs_per_100g: number
  fat_per_100g: number
}

export interface RecipeDetails {
  id: string
  name: string
  description: string | null
  image_url: string | null
  ingredients: RecipeIngredient[]
  nutrition: {
    calories: number
    protein: number
    carbs: number
    fat: number
  }
}

export function useRecipeDetails(recipeId: string | null) {
  const [data, setData] = useState<RecipeDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!recipeId) {
      setData(null)
      setLoading(false)
      setError(null)
      return
    }

    // Prevent duplicate fetches
    let isCancelled = false

    async function fetchRecipeDetails() {
      try {
        setLoading(true)
        setError(null)
        
        console.log('🔍 useRecipeDetails: Fetching details for recipe:', recipeId)
        
        const supabase = getSupabaseClient()
        
        // Get recipe basic info
        const { data: recipe, error: recipeError } = await supabase
          .from('recipes')
          .select('id, name, description, image_url')
          .eq('id', recipeId!)
          .single()

        if (isCancelled) return

        if (recipeError || !recipe) {
          console.error('❌ useRecipeDetails: Error fetching recipe:', recipeError)
          setError('Receita não encontrada')
          setLoading(false)
          return
        }

        console.log('✅ useRecipeDetails: Recipe found:', recipe.name)

        // Get recipe ingredients with food details
        const { data: ingredients, error: ingredientsError } = await supabase
          .from('recipe_ingredients')
          .select(`
            display_unit,
            quantity_in_grams,
            food:foods(
              name,
              calories_per_100g,
              protein_per_100g,
              carbs_per_100g,
              fat_per_100g
            )
          `)
          .eq('recipe_id', recipeId!)

        if (isCancelled) return

        if (ingredientsError) {
          console.error('❌ useRecipeDetails: Error fetching ingredients:', ingredientsError)
          setError('Erro ao buscar ingredientes')
          setLoading(false)
          return
        }

        console.log('✅ useRecipeDetails: Found', ingredients?.length || 0, 'ingredients')

        // Transform ingredients data
        const transformedIngredients: RecipeIngredient[] = (ingredients || []).map((ing: any) => ({
          display_unit: ing.display_unit,
          quantity_in_grams: ing.quantity_in_grams,
          food_name: ing.food?.name || '',
          calories_per_100g: ing.food?.calories_per_100g || 0,
          protein_per_100g: ing.food?.protein_per_100g || 0,
          carbs_per_100g: ing.food?.carbs_per_100g || 0,
          fat_per_100g: ing.food?.fat_per_100g || 0
        }))

        // Calculate total nutrition
        let totalCalories = 0
        let totalProtein = 0
        let totalCarbs = 0
        let totalFat = 0

        transformedIngredients.forEach((ingredient) => {
          const factor = ingredient.quantity_in_grams / 100
          totalCalories += ingredient.calories_per_100g * factor
          totalProtein += ingredient.protein_per_100g * factor
          totalCarbs += ingredient.carbs_per_100g * factor
          totalFat += ingredient.fat_per_100g * factor
        })

        const recipeDetails: RecipeDetails = {
          id: (recipe as any).id,
          name: (recipe as any).name,
          description: (recipe as any).description,
          image_url: (recipe as any).image_url,
          ingredients: transformedIngredients,
          nutrition: {
            calories: Math.round(totalCalories),
            protein: Math.round(totalProtein * 10) / 10,
            carbs: Math.round(totalCarbs * 10) / 10,
            fat: Math.round(totalFat * 10) / 10
          }
        }

        if (isCancelled) return

        console.log('🎉 useRecipeDetails: Recipe details complete with nutrition:', recipeDetails.nutrition)
        setData(recipeDetails)
        setLoading(false)

      } catch (error) {
        if (isCancelled) return
        console.error('💥 useRecipeDetails: Unexpected error:', error)
        setError('Erro interno')
        setLoading(false)
      }
    }

    fetchRecipeDetails()

    return () => {
      isCancelled = true
    }
  }, [recipeId])

  return { data, loading, error }
}
