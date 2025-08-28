'use client'

import { useState, useEffect, useCallback } from 'react'
import { WeeklyMealPlan, DayMealPlan, WeeklyPlanResponse } from '@/types/nutrition'

interface UseWeeklyMealPlanProps {
  userId: string
  isOpen: boolean // Só busca quando modal está aberto
}

interface UseWeeklyMealPlanReturn {
  weeklyPlan: WeeklyMealPlan | null
  selectedDay: string
  selectedDayData: DayMealPlan | null
  isLoading: boolean
  error: string | null
  setSelectedDay: (day: string) => void
  refreshData: () => Promise<void>
}

export function useWeeklyMealPlan({
  userId,
  isOpen
}: UseWeeklyMealPlanProps): UseWeeklyMealPlanReturn {
  const [weeklyPlan, setWeeklyPlan] = useState<WeeklyMealPlan | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Definir dia atual como padrão
  const getCurrentDay = useCallback(() => {
    const dayMapping = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday']
    return dayMapping[new Date().getDay()]
  }, [])

  // Buscar dados do plano semanal
  const fetchWeeklyPlan = useCallback(async () => {
    if (!userId || !isOpen) return

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/nutrition/weekly-plan/${userId}`)
      const data: WeeklyPlanResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch weekly plan')
      }

      if (data.success && data.data) {
        setWeeklyPlan(data.data)
        
        // Definir dia selecionado como hoje se ainda não foi definido
        if (!selectedDay) {
          const today = getCurrentDay()
          const availableDays = Object.keys(data.data.days)
          setSelectedDay(availableDays.includes(today) ? today : availableDays[0] || 'monday')
        }
      } else {
        throw new Error(data.error || 'Unknown error')
      }
    } catch (err) {
      console.error('Error fetching weekly plan:', err)
      setError(err instanceof Error ? err.message : 'Failed to load weekly plan')
      setWeeklyPlan(null)
    } finally {
      setIsLoading(false)
    }
  }, [userId, isOpen, selectedDay, getCurrentDay])

  // Refresh manual dos dados
  const refreshData = useCallback(async () => {
    await fetchWeeklyPlan()
  }, [fetchWeeklyPlan])

  // Buscar dados quando modal abre
  useEffect(() => {
    if (isOpen && userId) {
      fetchWeeklyPlan()
    }
  }, [isOpen, userId, fetchWeeklyPlan])

  // Reset quando modal fecha
  useEffect(() => {
    if (!isOpen) {
      setError(null)
      // Manter dados em cache, apenas limpar erro
    }
  }, [isOpen])

  // Calcular dados do dia selecionado
  const selectedDayData = weeklyPlan && selectedDay && weeklyPlan.days[selectedDay] 
    ? weeklyPlan.days[selectedDay] 
    : null

  return {
    weeklyPlan,
    selectedDay,
    selectedDayData,
    isLoading,
    error,
    setSelectedDay,
    refreshData
  }
}
