'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/components/auth-provider'
import MealConsumptionSingleton from '@/lib/meal-consumption-singleton'

interface UseMealConsumptionReturn {
  consumedMeals: Set<string>
  loading: boolean
  error: string | null
  consumeMeal: (mealId: string) => Promise<void>
  unConsumeMeal: (mealId: string) => Promise<void>
  isMealConsumed: (mealId: string) => boolean
}

export function useMealConsumption(date: string): UseMealConsumptionReturn {
  const { user } = useAuth()
  const singleton = MealConsumptionSingleton.getInstance()
  
  const [state, setState] = useState(() => singleton.getState())

  useEffect(() => {
    if (!user?.id) {
      console.log('⚠️ useMealConsumption: No user ID available')
      return
    }

    console.log(`🔗 useMealConsumption: Subscribing for user ${user.id} on date ${date}`)

    // Subscribe to singleton state changes
    const unsubscribe = singleton.subscribe(setState)

    // Initialize for current user and date
    singleton.initializeForUser(user.id, date)

    return () => {
      console.log('🧹 useMealConsumption: Unsubscribing')
      unsubscribe()
    }
  }, [user?.id, date, singleton])

  const consumeMeal = async (mealId: string): Promise<void> => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }
    await singleton.consumeMeal(user.id, mealId, date)
  }

  const unConsumeMeal = async (mealId: string): Promise<void> => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }
    await singleton.unConsumeMeal(user.id, mealId, date)
  }

  const isMealConsumed = (mealId: string): boolean => {
    return singleton.isMealConsumed(mealId)
  }

  return {
    consumedMeals: state.consumedMeals,
    loading: state.loading,
    error: state.error,
    consumeMeal,
    unConsumeMeal,
    isMealConsumed
  }
}
