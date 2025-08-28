"use client"

import React, { createContext, useContext, ReactNode } from 'react'
import { useMealConsumptionRealtime } from '@/hooks/nutrition/useMealConsumptionRealtime'

interface MealConsumptionContextType {
  consumedMeals: Set<string>
  isLoading: boolean
  error: string | null
  toggleConsumption: (recipeId: string) => Promise<void>
  isConsumptionLoading: (recipeId: string) => boolean
  refreshStatus: () => Promise<void>
}

const MealConsumptionContext = createContext<MealConsumptionContextType | undefined>(undefined)

interface MealConsumptionProviderProps {
  children: ReactNode
  selectedDate?: Date
}

export function MealConsumptionProvider({ 
  children, 
  selectedDate = new Date() 
}: MealConsumptionProviderProps) {
  // Use the real-time hook at the top level to ensure single instance
  const mealConsumptionState = useMealConsumptionRealtime({ selectedDate })

  return (
    <MealConsumptionContext.Provider value={mealConsumptionState}>
      {children}
    </MealConsumptionContext.Provider>
  )
}

export function useMealConsumptionContext(): MealConsumptionContextType {
  const context = useContext(MealConsumptionContext)
  
  if (context === undefined) {
    throw new Error('useMealConsumptionContext must be used within a MealConsumptionProvider')
  }
  
  return context
}

// Hook que pode ser usado com fallback se não estiver dentro do provider
export function useMealConsumptionContextSafe(): MealConsumptionContextType {
  const context = useContext(MealConsumptionContext)
  
  // Se não estiver dentro do provider, use o hook diretamente (fallback)
  const fallbackState = useMealConsumptionRealtime()
  
  return context || fallbackState
}
