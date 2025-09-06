import { useState, useEffect } from 'react'
import { getWorkoutDetails, getWorkoutTemplate } from '@/lib/training'
import type { WorkoutLogWithDetails, WorkoutTemplateWithExercises } from '@/lib/training'

interface UseWorkoutDetailsReturn {
  workoutDetails: WorkoutLogWithDetails | null
  workoutTemplate: WorkoutTemplateWithExercises | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useWorkoutDetails(workoutId: string | null): UseWorkoutDetailsReturn {
  const [workoutDetails, setWorkoutDetails] = useState<WorkoutLogWithDetails | null>(null)
  const [workoutTemplate, setWorkoutTemplate] = useState<WorkoutTemplateWithExercises | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchWorkoutDetails = async () => {
    if (!workoutId) {
      setWorkoutDetails(null)
      setWorkoutTemplate(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const details = await getWorkoutDetails(workoutId)
      setWorkoutDetails(details)

      // If we have details and a template ID, fetch the template details
      if (details && details.workout_template_id) {
        const template = await getWorkoutTemplate(details.workout_template_id)
        setWorkoutTemplate(template)
      } else {
        setWorkoutTemplate(null)
      }
    } catch (err) {
      console.error('Error fetching workout details:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar detalhes do treino')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchWorkoutDetails()
  }, [workoutId])

  return {
    workoutDetails,
    workoutTemplate,
    loading,
    error,
    refetch: fetchWorkoutDetails
  }
}

/**
 * Hook for workout template details (for active workouts)
 */
export function useWorkoutTemplate(templateId: string | null): {
  workoutTemplate: WorkoutTemplateWithExercises | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
} {
  const [workoutTemplate, setWorkoutTemplate] = useState<WorkoutTemplateWithExercises | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchTemplate = async () => {
    if (!templateId) {
      setWorkoutTemplate(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const template = await getWorkoutTemplate(templateId)
      setWorkoutTemplate(template)
    } catch (err) {
      console.error('Error fetching workout template:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar modelo de treino')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchTemplate()
  }, [templateId])

  return {
    workoutTemplate,
    loading,
    error,
    refetch: fetchTemplate
  }
}
