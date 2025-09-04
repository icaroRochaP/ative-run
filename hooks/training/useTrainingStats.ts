import { useState, useEffect } from 'react'
import { getTrainingStats } from '@/lib/training'

interface UseTrainingStatsReturn {
  workoutsThisMonth: number
  streakDays: number
  loading: boolean
  error: string | null
}

export function useTrainingStats(userId: string): UseTrainingStatsReturn {
  const [workoutsThisMonth, setWorkoutsThisMonth] = useState(0)
  const [streakDays, setStreakDays] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true

    const fetchStats = async () => {
      if (!userId) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)

        const stats = await getTrainingStats(userId)
        
        if (mounted) {
          setWorkoutsThisMonth(stats.workoutsThisMonth)
          setStreakDays(stats.streakDays)
        }
      } catch (err) {
        console.error('Error fetching training stats:', err)
        if (mounted) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar estatísticas')
          // Fallback values
          setWorkoutsThisMonth(0)
          setStreakDays(0)
        }
      } finally {
        if (mounted) {
          setLoading(false)
        }
      }
    }

    fetchStats()

    return () => {
      mounted = false
    }
  }, [userId])

  return {
    workoutsThisMonth,
    streakDays,
    loading,
    error
  }
}
