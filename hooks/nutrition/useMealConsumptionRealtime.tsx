"use client"

import { useState, useEffect, useCallback, useRef } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { RealtimeChannel } from '@supabase/supabase-js'

interface UseMealConsumptionRealtimeProps {
  userId?: string
  selectedDate?: Date
}

interface UseMealConsumptionRealtimeReturn {
  consumedMeals: Set<string> // Set de recipe IDs
  isLoading: boolean
  error: string | null
  toggleConsumption: (recipeId: string) => Promise<void>
  isConsumptionLoading: (recipeId: string) => boolean
  refreshStatus: () => Promise<void>
}

export function useMealConsumptionRealtime({
  userId,
  selectedDate = new Date()
}: UseMealConsumptionRealtimeProps = {}): UseMealConsumptionRealtimeReturn {
  
  const [consumedMeals, setConsumedMeals] = useState<Set<string>>(new Set())
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingRecipes, setLoadingRecipes] = useState<Set<string>>(new Set())
  
  // Use ref to track channel and prevent duplicate subscriptions
  const channelRef = useRef<RealtimeChannel | null>(null)
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
      console.log('📅 useMealConsumptionRealtime: Already loading for this date, skipping...')
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

      console.log('📅 useMealConsumptionRealtime: Loading consumption for date:', dateStr)
      
      // Buscar registros de consumo diretamente do Supabase
      const { data: consumptionLogs, error: fetchError } = await supabase
        .from('meal_consumption_logs')
        .select('recipe_id, id, consumed_at')
        .eq('user_id', user.id)
        .eq('consumed_at', dateStr)

      if (fetchError) {
        console.warn('⚠️ useMealConsumptionRealtime: Error loading consumption:', fetchError.message)
        setConsumedMeals(new Set())
        setError(null) // Clear error to prevent UI blocking
        setIsLoading(false)
        return
      }

      // Converter array para Set para performance
      const consumedSet = new Set(
        (consumptionLogs || []).map((log: any) => log.recipe_id)
      )
      
      console.log('✅ useMealConsumptionRealtime: Loaded consumption data:', consumedSet)
      setConsumedMeals(consumedSet)
      setError(null)

    } catch (err) {
      console.warn('⚠️ useMealConsumptionRealtime: Network error, continuing without consumption data:', err)
      setConsumedMeals(new Set())
      setError(null)
    } finally {
      setIsLoading(false)
      isLoadingRef.current = false
    }
  }, [selectedDate])

  // Setup real-time subscription
  const setupRealtimeSubscription = useCallback(async () => {
    const supabase = getSupabaseClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      console.warn('⚠️ useMealConsumptionRealtime: No user for real-time subscription')
      return
    }

    // Cleanup previous channel
    if (channelRef.current) {
      console.log('🧹 useMealConsumptionRealtime: Cleaning up previous channel')
      await supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }

    // Create new channel for this date and user
    const dateStr = formatDate(selectedDate)
    const channelName = `meal_consumption_${user.id}_${dateStr}`
    
    console.log('🔗 useMealConsumptionRealtime: Setting up real-time subscription for:', channelName)
    
    const channel = supabase
      .channel(channelName)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'meal_consumption_logs',
          filter: `user_id=eq.${user.id} AND consumed_at=eq.${dateStr}`,
        },
        (payload) => {
          console.log('🔄 useMealConsumptionRealtime: Received real-time update:', payload)
          
          // Safely extract recipe_id from payload with proper type checking
          const newRecord = payload.new as any
          const oldRecord = payload.old as any
          const recipeId = newRecord?.recipe_id || oldRecord?.recipe_id
          
          if (!recipeId) {
            console.warn('⚠️ useMealConsumptionRealtime: No recipe_id in payload')
            return
          }

          // Update state based on event type
          setConsumedMeals(prev => {
            const newSet = new Set(prev)
            
            if (payload.eventType === 'INSERT') {
              newSet.add(recipeId)
              console.log('➕ useMealConsumptionRealtime: Added recipe to consumed:', recipeId)
            } else if (payload.eventType === 'DELETE') {
              newSet.delete(recipeId)
              console.log('➖ useMealConsumptionRealtime: Removed recipe from consumed:', recipeId)
            }
            
            console.log('🔄 useMealConsumptionRealtime: Updated consumed meals:', newSet)
            return newSet
          })
        }
      )
      .subscribe((status) => {
        console.log('📡 useMealConsumptionRealtime: Subscription status:', status)
      })

    channelRef.current = channel
  }, [selectedDate])

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

  // Setup inicial e cleanup
  useEffect(() => {
    const init = async () => {
      await loadConsumptionStatus()
      await setupRealtimeSubscription()
    }
    
    init()

    // Cleanup on unmount or date change
    return () => {
      if (channelRef.current) {
        console.log('🧹 useMealConsumptionRealtime: Cleaning up on unmount')
        const supabase = getSupabaseClient()
        supabase.removeChannel(channelRef.current)
        channelRef.current = null
      }
    }
  }, [selectedDate, loadConsumptionStatus, setupRealtimeSubscription])

  return {
    consumedMeals,
    isLoading,
    error,
    toggleConsumption,
    isConsumptionLoading,
    refreshStatus
  }
}
