"use client"

import { useMealConsumptionContextSafe } from '@/contexts/MealConsumptionContext'

/**
 * Hook simplificado que usa o context global de consumo de refeições
 * Evita múltiplas instâncias e sincroniza automaticamente via real-time
 */
export function useSimpleMealConsumption() {
  return useMealConsumptionContextSafe()
}
