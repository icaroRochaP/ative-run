import { useState, useEffect, useCallback, useRef } from 'react'
import { getActiveTrainingPlan, getWeeklyWorkoutSchedule, getDayOrder } from '@/lib/training'
import type { TrainingPlanWithWorkouts, WeeklyWorkoutSchedule } from '@/lib/training'
import { supabase } from '@/lib/supabase'

interface UseTrainingPlanReturn {
  trainingPlan: TrainingPlanWithWorkouts | null
  weeklySchedule: WeeklyWorkoutSchedule | null
  loading: boolean
  error: string | null
  hasNoPlan: boolean
  refetch: () => Promise<void>
}

// Simple cache to avoid unnecessary refetches
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 30000 // 30 seconds

export function useTrainingPlan(userId: string): UseTrainingPlanReturn {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlanWithWorkouts | null>(null)
  const [weeklySchedule, setWeeklySchedule] = useState<WeeklyWorkoutSchedule | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null)

  const fetchTrainingData = useCallback(async () => {
    if (!userId) {
      setLoading(false)
      return
    }

    // Cancel previous request if still pending
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Create new abort controller for this request
    abortControllerRef.current = new AbortController()
    const currentController = abortControllerRef.current

    try {
      setLoading(true)
      setError(null)

      // Check cache first
      const cacheKey = `training-plan-${userId}`
      const cached = cache.get(cacheKey)
      const now = Date.now()
      
      if (cached && (now - cached.timestamp) < CACHE_DURATION) {
        console.log('🎯 Using cached training data')
        setTrainingPlan(cached.data.trainingPlan)
        setWeeklySchedule(cached.data.weeklySchedule)
        setLoading(false)
        return
      }

      console.log('🔄 Fetching fresh training data...')
      
      // Get active training plan
      const plan = await getActiveTrainingPlan(userId)
      
      // Check if request was aborted
      if (currentController.signal.aborted) {
        return
      }
      
      setTrainingPlan(plan)

      if (plan) {
        // Get weekly schedule with detailed information
        const schedule = await getWeeklyWorkoutSchedule(plan.id)
        
        // Check if request was aborted
        if (currentController.signal.aborted) {
          return
        }
        
        // Sort workouts by day of week
        if (schedule) {
          schedule.workouts.sort((a, b) => 
            getDayOrder(a.day_of_week) - getDayOrder(b.day_of_week)
          )
        }
        
        setWeeklySchedule(schedule)

        // Update cache
        cache.set(cacheKey, {
          data: { trainingPlan: plan, weeklySchedule: schedule },
          timestamp: now
        })
        
        console.log('✅ Training data loaded and cached')
      } else {
        setWeeklySchedule(null)
      }
    } catch (err) {
      // Don't set error if request was aborted
      if (currentController.signal.aborted) {
        return
      }
      
      console.error('❌ Error fetching training data:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar dados de treino')
    } finally {
      // Don't update loading state if request was aborted
      if (!currentController.signal.aborted) {
        setLoading(false)
      }
    }
  }, [userId])

  useEffect(() => {
    fetchTrainingData()
    
    // Cleanup function to abort ongoing requests
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [fetchTrainingData])

  // Optimized real-time subscription with debouncing
  useEffect(() => {
    if (!userId || !supabase) return

    let debounceTimer: NodeJS.Timeout

    const subscription = supabase
      .channel(`training-plan-${userId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'workout_logs',
          filter: `user_id=eq.${userId}`
        },
        (payload) => {
          console.log('🔔 Workout log change detected:', payload.eventType)
          
          // Clear existing timer
          if (debounceTimer) {
            clearTimeout(debounceTimer)
          }
          
          // Debounce the refresh to avoid multiple rapid updates
          debounceTimer = setTimeout(() => {
            // Invalidate cache
            const cacheKey = `training-plan-${userId}`
            cache.delete(cacheKey)
            
            // Refresh only the weekly schedule to update completion status
            if (trainingPlan) {
              console.log('🔄 Refreshing workout completion status...')
              getWeeklyWorkoutSchedule(trainingPlan.id).then(schedule => {
                if (schedule) {
                  schedule.workouts.sort((a, b) => 
                    getDayOrder(a.day_of_week) - getDayOrder(b.day_of_week)
                  )
                  setWeeklySchedule(schedule)
                  
                  // Update cache with new schedule
                  cache.set(cacheKey, {
                    data: { trainingPlan, weeklySchedule: schedule },
                    timestamp: Date.now()
                  })
                }
              }).catch(console.error)
            }
          }, 500) // 500ms debounce
        }
      )
      .subscribe()

    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer)
      }
      subscription.unsubscribe()
    }
  }, [userId, trainingPlan])

  const hasNoPlan = !loading && !error && !trainingPlan

  return {
    trainingPlan,
    weeklySchedule,
    loading,
    error,
    hasNoPlan,
    refetch: fetchTrainingData
  }
}
