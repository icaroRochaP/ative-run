"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { 
  findActiveWorkout,
  findOrCreateWorkoutAndLogSet, 
  removeLoggedSet, 
  finishWorkout, 
  getCompletedSets,
  getActiveWorkout,
  diagnoseWorkoutSets
} from "@/lib/training"
import { supabase } from "@/lib/supabase"

interface WorkoutSessionState {
  workoutLogId: string | null
  completedSets: Record<string, boolean>
  loading: boolean
  error: string | null
  isStarted: boolean
  isFinished: boolean
}

export function useWorkoutSession(userId: string, workoutTemplateId: string | null) {
  const [state, setState] = useState<WorkoutSessionState>({
    workoutLogId: null,
    completedSets: {},
    loading: false,
    error: null,
    isStarted: false,
    isFinished: false
  })

  // Track pending operations to prevent race conditions
  const pendingOperations = useRef<Set<string>>(new Set())

  // Load existing active workout on mount
  useEffect(() => {
    if (!userId || !workoutTemplateId) {
      setState(prev => ({ ...prev, loading: false }))
      return
    }

    const loadActiveWorkout = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const activeWorkout = await getActiveWorkout(userId)
        
        if (activeWorkout && activeWorkout.workout_template_id === workoutTemplateId) {
          // Load completed sets for this workout
          const sets = await getCompletedSets(activeWorkout.id)
          
          // Buscar template para fazer correlação correta
          if (supabase) {
            const { data: templateData, error: templateError } = await supabase
              .from("workout_templates")
              .select(`
                id,
                workout_template_exercises (
                  id,
                  exercise_id,
                  target_sets,
                  exercise:exercises (*)
                )
              `)
              .eq("id", workoutTemplateId)
              .single()

            if (templateError) throw templateError

            const completedSetsMap: Record<string, boolean> = {};
            
            // Para cada template exercise, buscar os sets correspondentes no banco
            // Isso resolve o problema de exercícios duplicados com mesmo exercise_id
            (templateData as any)?.workout_template_exercises?.forEach((templateExercise: any) => {
              // Buscar todos os sets deste exercício específico
              const exerciseSets = sets.filter((set: any) => set.exercise_id === templateExercise.exercise_id)
              
              // Se há sets para este exercício, precisamos correlacioná-los corretamente
              if (exerciseSets.length > 0) {
                // Limitar os sets ao número de target_sets para este template exercise
                const targetSets = templateExercise.target_sets || 0
                
                // Pegar apenas os primeiros sets até o limite de target_sets
                exerciseSets.slice(0, targetSets).forEach((set: any) => {
                  const setId = `${templateExercise.id}-set-${set.set_number}`
                  completedSetsMap[setId] = true
                })
              }
            })

            setState(prev => ({
              ...prev,
              workoutLogId: activeWorkout.id,
              completedSets: completedSetsMap,
              isStarted: true,
              isFinished: !!activeWorkout.completed_at,
              loading: false
            }))
          } else {
            setState(prev => ({ ...prev, loading: false }))
          }
        } else {
          setState(prev => ({ ...prev, loading: false }))
        }
      } catch (error) {
        console.error('Error loading active workout:', error)
        setState(prev => ({ 
          ...prev, 
          loading: false, 
          error: error instanceof Error ? error.message : 'Erro ao carregar treino ativo'
        }))
      }
    }

    loadActiveWorkout()
  }, [userId, workoutTemplateId])

  // Real-time subscription to set_logs changes
  useEffect(() => {
    if (!userId || !workoutTemplateId || !state.workoutLogId || !supabase) return

    console.log(`🔗 Creating subscription for workout: ${state.workoutLogId}`)

    const subscription = supabase
      .channel(`workout-session-${state.workoutLogId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'set_logs',
          filter: `workout_log_id=eq.${state.workoutLogId}`
        },
        (payload) => {
          console.log('Set log change detected:', payload)
          // Reload completed sets when changes occur
          loadCompletedSets()
        }
      )
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'workout_logs',
          filter: `id=eq.${state.workoutLogId}`
        },
        (payload) => {
          console.log('Workout log change detected:', payload)
          // Check if workout was finished
          if ((payload.new as any)?.completed_at) {
            setState(prev => ({ ...prev, isFinished: true }))
          }
        }
      )
      .subscribe()

    return () => {
      console.log(`🧹 Unsubscribing from workout: ${state.workoutLogId}`)
      subscription.unsubscribe()
    }
  }, [state.workoutLogId, userId, workoutTemplateId]) // Only depend on essential values

  const loadCompletedSets = useCallback(async () => {
    if (!userId || !workoutTemplateId || !state.workoutLogId || !supabase) return

    try {
      const sets = await getCompletedSets(state.workoutLogId)
      
      // Precisamos correlacionar os sets salvos no banco (que usam exercise_id) 
      // com os templateExercise.id para mostrar na UI
      // Vamos buscar o template para fazer a correlação correta
      
      const { data: templateData, error: templateError } = await supabase
        .from("workout_templates")
        .select(`
          id,
          workout_template_exercises (
            id,
            exercise_id,
            target_sets,
            exercise:exercises (*)
          )
        `)
        .eq("id", workoutTemplateId)
        .single()

      if (templateError) throw templateError

      // Build a clean state map with correct template exercise IDs
      const completedSetsMap: Record<string, boolean> = {};
      
      // Para cada template exercise, buscar os sets correspondentes no banco
      // Isso resolve o problema de exercícios duplicados com mesmo exercise_id
      (templateData as any)?.workout_template_exercises?.forEach((templateExercise: any) => {
        // Buscar todos os sets deste exercício específico
        const exerciseSets = sets.filter((set: any) => set.exercise_id === templateExercise.exercise_id)
        
        // Se há sets para este exercício, precisamos correlacioná-los corretamente
        if (exerciseSets.length > 0) {
          // Limitar os sets ao número de target_sets para este template exercise
          const targetSets = templateExercise.target_sets || 0
          
          // Pegar apenas os primeiros sets até o limite de target_sets
          exerciseSets.slice(0, targetSets).forEach((set: any) => {
            const setId = `${templateExercise.id}-set-${set.set_number}`
            completedSetsMap[setId] = true
          })
        }
      })

      console.log('Loading completed sets from DB:', { totalSets: sets.length, completedSetsMap })

      setState(prev => ({
        ...prev,
        completedSets: completedSetsMap
      }))
    } catch (error) {
      console.error('Error loading completed sets:', error)
    }
  }, [userId, workoutTemplateId, state.workoutLogId, supabase])

  // Check for existing active workout on mount and template change
  useEffect(() => {
    if (!userId || !workoutTemplateId) return

    let mounted = true

    const checkActiveWorkout = async () => {
      try {
        setState(prev => ({ ...prev, loading: true, error: null }))
        
        const activeWorkoutId = await findActiveWorkout(userId, workoutTemplateId)
        
        if (!mounted) return

        if (activeWorkoutId) {
          setState(prev => ({
            ...prev,
            workoutLogId: activeWorkoutId,
            isStarted: true,
            loading: false
          }))
        } else {
          setState(prev => ({
            ...prev,
            workoutLogId: null,
            isStarted: false,
            loading: false
          }))
        }
      } catch (error) {
        if (mounted) {
          console.error('Error checking active workout:', error)
          setState(prev => ({
            ...prev,
            loading: false,
            error: error instanceof Error ? error.message : 'Erro ao verificar treino ativo'
          }))
        }
      }
    }

    checkActiveWorkout()

    return () => {
      mounted = false
    }
  }, [userId, workoutTemplateId])

  const toggleSetCompletion = useCallback(async (
    setId: string, 
    exerciseId: string, 
    setNumber: number,
    completedReps?: number,
    weightKg?: number
  ) => {
    if (!userId || !workoutTemplateId) {
      console.error('No user ID or workout template ID available')
      return
    }

    // Prevent multiple simultaneous operations on the same set
    const operationKey = `${setId}-${Date.now()}`
    if (pendingOperations.current.has(setId)) {
      console.log(`Operation already pending for set ${setId}, skipping...`)
      return
    }

    pendingOperations.current.add(setId)

    const isCompleted = state.completedSets[setId]

    try {
      setState(prev => ({ ...prev, error: null }))

      // **OPTIMISTIC UPDATE** - Update UI immediately for instant feedback
      setState(prev => ({ 
        ...prev, 
        completedSets: {
          ...prev.completedSets,
          [setId]: !isCompleted
        }
      }))

      if (isCompleted) {
        // Remove the set from database (requires existing workout)
        if (state.workoutLogId) {
          await removeLoggedSet(state.workoutLogId, exerciseId, setNumber)
          console.log(`Removed set ${setNumber} for exercise ${exerciseId}`)
        }
      } else {
        // Add the set to database (auto-creates workout if needed)
        const workoutLogId = await findOrCreateWorkoutAndLogSet(
          userId, 
          workoutTemplateId, 
          exerciseId, 
          setNumber, 
          completedReps, 
          weightKg
        )
        
        // Update workout ID if this was the first set (workout was just created)
        if (!state.workoutLogId) {
          setState(prev => ({
            ...prev,
            workoutLogId,
            isStarted: true
          }))
        }
        
        console.log(`Added set ${setNumber} for exercise ${exerciseId}`)
      }
      
      // Real-time subscription will confirm/correct the state from database
      
    } catch (error) {
      console.error('Error toggling set completion:', error)
      
      // **REVERT OPTIMISTIC UPDATE** if database operation failed
      setState(prev => ({ 
        ...prev, 
        completedSets: {
          ...prev.completedSets,
          [setId]: isCompleted // Revert to original state
        },
        error: error instanceof Error ? error.message : 'Erro ao marcar série'
      }))
    } finally {
      // Always clean up the pending operation
      pendingOperations.current.delete(setId)
    }
  }, [userId, workoutTemplateId, state.workoutLogId, state.completedSets])

  const finishWorkoutSession = useCallback(async (allSetsCompleted: boolean = true) => {
    if (!userId || !workoutTemplateId || !state.workoutLogId || state.isFinished) return

    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      await finishWorkout(state.workoutLogId, allSetsCompleted)
      
      setState(prev => ({
        ...prev,
        isFinished: true,
        loading: false
      }))
    } catch (error) {
      console.error('Error finishing workout:', error)
      setState(prev => ({ 
        ...prev, 
        loading: false, 
        error: error instanceof Error ? error.message : 'Erro ao finalizar treino'
      }))
      throw error
    }
  }, [userId, workoutTemplateId, state.workoutLogId, state.isFinished])

  const resetSession = useCallback(() => {
    setState({
      workoutLogId: null,
      completedSets: {},
      loading: false,
      error: null,
      isStarted: false,
      isFinished: false
    })
  }, [])

  const diagnoseSession = useCallback(async () => {
    if (userId) {
      await diagnoseWorkoutSets(userId)
    }
  }, [userId])

  // Add debug functions to window for easy access in browser console
  useEffect(() => {
    if (typeof window !== 'undefined') {
      (window as any).debugWorkout = {
        diagnose: () => diagnoseSession(),
        state: () => console.log('Current workout state:', state),
        userId: userId?.slice(0, 8) + '...'
      }
    }
  }, [diagnoseSession, state, userId])

  return {
    ...state,
    toggleSetCompletion,
    finishWorkout: finishWorkoutSession,
    resetSession,
    diagnose: diagnoseSession
  }
}
