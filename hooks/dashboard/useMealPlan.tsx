"use client"

import { useState } from "react"
import { MealPlan, Meal } from "@/types/dashboard"

export function useMealPlan() {
  const weeklyMealPlan: MealPlan = {
    monday: {
      day: "Monday",
      totalCalories: 1450,
      meals: [
        {
          meal: "Breakfast",
          calories: 450,
          protein: "25g",
          carbs: "45g",
          fat: "18g",
          foods: ["2 eggs", "1 slice whole grain bread", "1/2 avocado", "1 cup coffee"],
        },
        {
          meal: "Lunch",
          calories: 520,
          protein: "35g",
          carbs: "40g",
          fat: "22g",
          foods: ["150g grilled chicken", "100g brown rice", "Mixed vegetables", "1 tbsp olive oil"],
        },
        {
          meal: "Dinner",
          calories: 480,
          protein: "30g",
          carbs: "35g",
          fat: "20g",
          foods: ["120g salmon", "150g sweet potato", "Green salad", "1 tbsp dressing"],
        },
      ],
    },
    tuesday: {
      day: "Tuesday",
      totalCalories: 1420,
      meals: [
        {
          meal: "Breakfast",
          calories: 420,
          protein: "22g",
          carbs: "48g",
          fat: "16g",
          foods: ["1 cup oatmeal", "1 banana", "1 tbsp almond butter", "1 cup green tea"],
        },
        {
          meal: "Lunch",
          calories: 540,
          protein: "38g",
          carbs: "42g",
          fat: "24g",
          foods: ["150g turkey breast", "100g quinoa", "Roasted vegetables", "1 tbsp tahini"],
        },
        {
          meal: "Dinner",
          calories: 460,
          protein: "28g",
          carbs: "38g",
          fat: "18g",
          foods: ["120g white fish", "150g roasted potatoes", "Steamed broccoli", "Lemon dressing"],
        },
      ],
    },
    wednesday: {
      day: "Wednesday",
      totalCalories: 1480,
      meals: [
        {
          meal: "Breakfast",
          calories: 480,
          protein: "28g",
          carbs: "42g",
          fat: "20g",
          foods: ["Greek yogurt", "Mixed berries", "Granola", "1 tbsp honey"],
        },
        {
          meal: "Lunch",
          calories: 500,
          protein: "32g",
          carbs: "45g",
          fat: "20g",
          foods: ["150g lean beef", "100g pasta", "Tomato sauce", "Parmesan cheese"],
        },
        {
          meal: "Dinner",
          calories: 500,
          protein: "35g",
          carbs: "30g",
          fat: "25g",
          foods: ["150g chicken thigh", "Mixed green salad", "Nuts", "Olive oil dressing"],
        },
      ],
    },
    thursday: {
      day: "Thursday",
      totalCalories: 1440,
      meals: [
        {
          meal: "Breakfast",
          calories: 440,
          protein: "24g",
          carbs: "46g",
          fat: "18g",
          foods: ["Protein smoothie", "1 banana", "Spinach", "Almond milk"],
        },
        {
          meal: "Lunch",
          calories: 520,
          protein: "36g",
          carbs: "38g",
          fat: "22g",
          foods: ["150g pork tenderloin", "100g wild rice", "Asparagus", "Herb butter"],
        },
        {
          meal: "Dinner",
          calories: 480,
          protein: "30g",
          carbs: "40g",
          fat: "18g",
          foods: ["120g cod", "150g mashed cauliflower", "Green beans", "Lemon"],
        },
      ],
    },
    friday: {
      day: "Friday",
      totalCalories: 1460,
      meals: [
        {
          meal: "Breakfast",
          calories: 460,
          protein: "26g",
          carbs: "44g",
          fat: "19g",
          foods: ["2 whole grain pancakes", "Greek yogurt", "Blueberries", "Maple syrup"],
        },
        {
          meal: "Lunch",
          calories: 510,
          protein: "34g",
          carbs: "41g",
          fat: "21g",
          foods: ["150g grilled shrimp", "100g couscous", "Mediterranean vegetables", "Feta cheese"],
        },
        {
          meal: "Dinner",
          calories: 490,
          protein: "32g",
          carbs: "36g",
          fat: "22g",
          foods: ["120g lamb", "Roasted root vegetables", "Mint sauce", "Side salad"],
        },
      ],
    },
    saturday: {
      day: "Saturday",
      totalCalories: 1500,
      meals: [
        {
          meal: "Breakfast",
          calories: 500,
          protein: "30g",
          carbs: "40g",
          fat: "22g",
          foods: ["Veggie omelet", "2 eggs", "Cheese", "Whole grain toast"],
        },
        {
          meal: "Lunch",
          calories: 530,
          protein: "38g",
          carbs: "38g",
          fat: "24g",
          foods: ["150g chicken breast", "Quinoa salad", "Avocado", "Lime dressing"],
        },
        {
          meal: "Dinner",
          calories: 470,
          protein: "28g",
          carbs: "42g",
          fat: "18g",
          foods: ["120g sea bass", "150g jasmine rice", "Stir-fried vegetables", "Ginger sauce"],
        },
      ],
    },
    sunday: {
      day: "Sunday",
      totalCalories: 1420,
      meals: [
        {
          meal: "Breakfast",
          calories: 420,
          protein: "22g",
          carbs: "48g",
          fat: "16g",
          foods: ["Chia pudding", "Coconut milk", "Fresh fruits", "Almonds"],
        },
        {
          meal: "Lunch",
          calories: 540,
          protein: "36g",
          carbs: "40g",
          fat: "24g",
          foods: ["150g turkey", "Sweet potato", "Brussels sprouts", "Cranberry sauce"],
        },
        {
          meal: "Dinner",
          calories: 460,
          protein: "30g",
          carbs: "35g",
          fat: "18g",
          foods: ["120g tuna steak", "Quinoa", "Grilled zucchini", "Herb oil"],
        },
      ],
    },
  }

  // Daily nutrition goals
  const dailyNutrition = {
    calories: 1450,
    protein: 120,
    carbs: 150,
    fat: 70,
  }

  // Today's meals (Monday by default)
  const todayMeals = weeklyMealPlan.monday.meals

  return {
    weeklyMealPlan,
    dailyNutrition,
    todayMeals,
  }
}
