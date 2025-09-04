import { useState, useEffect } from 'react'
import { useAuth } from '@/components/auth-provider'

export interface WeightGoal {
  id: string
  user_id: string
  target_weight: number
  current_weight?: number
  start_weight?: number
  start_date: string
  target_date?: string
  is_active: boolean
  notes?: string
  created_at: string
  updated_at: string
}

export function useWeightGoals() {
  const { user } = useAuth()
  const [goal, setGoal] = useState<WeightGoal | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchGoal = async () => {
    if (!user?.id) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch(`/api/weight-goals?userId=${user.id}`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch weight goal')
      }

      const result = await response.json()
      setGoal(result.data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  const createGoal = async (goalData: {
    target_weight: number
    current_weight?: number
    start_weight?: number
    target_date?: string
    notes?: string
  }) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch(`/api/weight-goals?userId=${user.id}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...goalData, userId: user.id })
      })

      if (!response.ok) {
        throw new Error('Failed to create weight goal')
      }

      const result = await response.json()
      setGoal(result.data)
      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  const updateGoal = async (goalData: {
    target_weight?: number
    current_weight?: number
    target_date?: string
    notes?: string
  }) => {
    if (!user?.id) {
      throw new Error('User not authenticated')
    }

    try {
      const response = await fetch(`/api/weight-goals?userId=${user.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ...goalData, userId: user.id })
      })

      if (!response.ok) {
        throw new Error('Failed to update weight goal')
      }

      const result = await response.json()
      setGoal(result.data)
      return result
    } catch (err) {
      throw new Error(err instanceof Error ? err.message : 'Unknown error')
    }
  }

  useEffect(() => {
    if (user?.id) {
      fetchGoal()
    }
  }, [user?.id])

  return {
    goal,
    loading,
    error,
    refetch: fetchGoal,
    createGoal,
    updateGoal
  }
}
