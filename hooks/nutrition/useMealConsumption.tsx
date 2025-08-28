"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { ConsumeRequest, UnconsumeRequest, ConsumptionStatusResponse } from '@/types/nutrition'

interface UseMealConsumptionProps {
  userId?: string
  selectedDate?: Date
}

interface UseMealConsumptionReturn {
  consumedMeals: Set<string> // Set de recipe IDs
  isLoading: boolean
  error: string | null
  toggleConsumption: (recipeId: string) => Promise<void>
  isConsumptionLoading: (recipeId: string) => boolean
  refreshStatus: () => Promise<void>
}

export function useMealConsumption({
  userId,
  selectedDate = new Date()
}: UseMealConsumptionProps = {}): UseMealConsumptionReturn {
  
  const [consumedMeals, setConsumedMeals] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingRecipes, setLoadingRecipes] = useState<Set<string>>(new Set())
  
  // Use ref to track if we're already loading to prevent multiple simultaneous calls
  const isLoadingRef = useRef(false)
  const dateStringRef = useRef<string>('')

  // Formatar data para API
  const formatDate = (date: Date): string => {
    return date.toISOString().split('T')[0]
  }

  // Carregar status inicial de consumo
  const loadConsumptionStatus = useCallback(async () => {
    const dateStr = formatDate(selectedDate)
    
    // Prevent duplicate calls for the same date
    if (isLoadingRef.current && dateStringRef.current === dateStr) {
      console.log('📅 useMealConsumption: Already loading for this date, skipping...')
      return
    }
    
    try {
      isLoadingRef.current = true
      dateStringRef.current = dateStr
      setIsLoading(true)
      setError(null)

      const supabase = getSupabaseClient()
      
      // Verificar usuário atual
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setError('User not authenticated')
        setIsLoading(false)
        return
      }

      console.log('📅 useMealConsumption: Loading consumption for date:', dateStr)
      
      // Buscar registros de consumo diretamente do Supabase
      const { data: consumptionLogs, error: fetchError } = await supabase
        .from('meal_consumption_logs')
        .select('recipe_id, id, consumed_at')
        .eq('user_id', user.id)
        .eq('consumed_at', dateStr)

      if (fetchError) {
        console.warn('⚠️ useMealConsumption: Error loading consumption:', fetchError.message)
        // Don't block the UI - continue with empty set
        setConsumedMeals(new Set())
        setError(null) // Clear error to prevent UI blocking
        setIsLoading(false)
        return
      }

      // Converter array para Set para performance
      const consumedSet = new Set(
        (consumptionLogs || []).map((log: any) => log.recipe_id)
      )
      
      console.log('✅ useMealConsumption: Loaded consumption data:', consumedSet)
      setConsumedMeals(consumedSet)
      setError(null)

    } catch (err) {
      console.warn('⚠️ useMealConsumption: Network error, continuing without consumption data:', err)
      // Don't block the UI - set empty state and continue
      setConsumedMeals(new Set())
      setError(null)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [selectedDate]) // Apenas selectedDate como dependência

  // Toggle consumo de refeição com optimistic update
  const toggleConsumption = useCallback(async (recipeId: string) => {
    try {
      // Prevenir cliques duplos
      if (loadingRecipes.has(recipeId)) {
        return
      }

      // Adicionar ao loading state
      setLoadingRecipes(prev => new Set([...prev, recipeId]))
      
      const isCurrentlyConsumed = consumedMeals.has(recipeId)
      const dateStr = formatDate(selectedDate)

      // Optimistic update - atualizar UI imediatamente
      setConsumedMeals(prev => {
        const newSet = new Set(prev)
        if (isCurrentlyConsumed) {
          newSet.delete(recipeId)
        } else {
          newSet.add(recipeId)
        }
        return newSet
      })

      const supabase = getSupabaseClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        throw new Error('User not authenticated')
      }

      // Realizar operação no Supabase
      if (isCurrentlyConsumed) {
        // Desmarcar consumo
        const { error } = await supabase
          .from('meal_consumption_logs')
          .delete()
          .eq('user_id', user.id)
          .eq('recipe_id', recipeId)
          .eq('consumed_at', dateStr)

        if (error) {
          // Reverter optimistic update em caso de erro
          setConsumedMeals(prev => new Set([...prev, recipeId]))
          setError('Failed to unmark meal consumption')
          return
        }

      } else {
        // Marcar como consumido
        const { error } = await supabase
          .from('meal_consumption_logs')
          .insert({
            user_id: user.id,
            recipe_id: recipeId,
            consumed_at: dateStr
          })

        if (error) {
          // Reverter optimistic update em caso de erro
          setConsumedMeals(prev => {
            const newSet = new Set(prev)
            newSet.delete(recipeId)
            return newSet
          })
          setError('Failed to mark meal as consumed')
          return
        }
      }

      // Limpar qualquer erro anterior
      setError(null)

    } catch (err) {
      console.error('Error toggling meal consumption:', err)
      
      // Reverter optimistic update em caso de erro
      const isCurrentlyConsumed = consumedMeals.has(recipeId)
      setConsumedMeals(prev => {
        const newSet = new Set(prev)
        if (isCurrentlyConsumed) {
          newSet.add(recipeId)
        } else {
          newSet.delete(recipeId)
        }
        return newSet
      })
      
      setError('Network error while updating meal consumption')
    } finally {
      // Remover do loading state
      setLoadingRecipes(prev => {
        const newSet = new Set(prev)
        newSet.delete(recipeId)
        return newSet
      })
    }
  }, [consumedMeals, selectedDate, loadingRecipes])

  // Verificar se refeição específica está em loading
  const isConsumptionLoading = useCallback((recipeId: string): boolean => {
    return loadingRecipes.has(recipeId)
  }, [loadingRecipes])

  // Refresh manual do status
  const refreshStatus = useCallback(async () => {
    await loadConsumptionStatus()
  }, [loadConsumptionStatus])

  // Carregar status inicial e quando data muda
  useEffect(() => {
    loadConsumptionStatus()
  }, [selectedDate]) // Apenas depender da data, não da função

  return {
    consumedMeals,
    isLoading,
    error,
    toggleConsumption,
    isConsumptionLoading,
    refreshStatus
  }
}
