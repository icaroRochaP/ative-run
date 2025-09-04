import { useState, useEffect } from 'react'
import { getWorkoutHistory } from '@/lib/training'
import type { WorkoutLogWithDetails } from '@/lib/training'

interface UseWorkoutHistoryReturn {
  workoutHistory: WorkoutLogWithDetails[]
  loading: boolean
  error: string | null
  hasMore: boolean
  currentPage: number
  totalPages: number
  loadMore: () => Promise<void>
  refetch: () => Promise<void>
  goToPage: (page: number) => Promise<void>
}

interface UseWorkoutHistoryOptions {
  limit?: number
  initialLoad?: boolean
}

export function useWorkoutHistory(
  userId: string, 
  options: UseWorkoutHistoryOptions = {}
): UseWorkoutHistoryReturn {
  const { limit = 10, initialLoad = true } = options
  
  const [workoutHistory, setWorkoutHistory] = useState<WorkoutLogWithDetails[]>([])
  const [loading, setLoading] = useState(initialLoad)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [hasMore, setHasMore] = useState(true)

  const fetchWorkoutHistory = async (page: number = 0, append: boolean = false) => {
    if (!userId) {
      setLoading(false)
      return
    }

    try {
      if (!append) {
        setLoading(true)
      }
      setError(null)

      const offset = page * limit
      
      // Fetch one extra item to determine if there are more pages
      const data = await getWorkoutHistory(userId, limit + 1, offset)

      // Check if we got more than requested limit
      const hasMore = data.length > limit
      
      // Take only the requested number of items
      const actualData = hasMore ? data.slice(0, limit) : data

      if (append) {
        setWorkoutHistory(prev => [...prev, ...actualData])
      } else {
        setWorkoutHistory(actualData)
      }

      setHasMore(hasMore)
      setCurrentPage(page)
      
      console.log(`📊 Pagination state: page=${page}, limit=${limit}, received=${data.length}, hasMore=${hasMore}, offset=${offset}`)
    } catch (err) {
      console.error('Error fetching workout history:', err)
      setError(err instanceof Error ? err.message : 'Erro ao carregar histórico de treinos')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (initialLoad) {
      fetchWorkoutHistory(0, false)
    }
  }, [userId, initialLoad])

  const loadMore = async () => {
    if (!hasMore || loading) return
    
    const nextPage = currentPage + 1
    await fetchWorkoutHistory(nextPage, true)
  }

  const refetch = async () => {
    await fetchWorkoutHistory(0, false)
  }

  const goToPage = async (page: number) => {
    await fetchWorkoutHistory(page, false)
  }

  // Calculate total pages based on current data and hasMore flag
  // This ensures consistent pagination behavior
  const totalPages = (() => {
    // If we have no data, show 1 page
    if (workoutHistory.length === 0 && currentPage === 0) {
      return 1
    }
    
    // If we're on page 0 and have less than limit items, it's only 1 page
    if (currentPage === 0 && workoutHistory.length < limit) {
      return 1
    }
    
    // If we're on page 0 and have exactly limit items, check hasMore
    if (currentPage === 0) {
      return hasMore ? 2 : 1
    }
    
    // If we're on a later page, calculate based on current page + potential next page
    return currentPage + (hasMore ? 2 : 1)
  })()

  return {
    workoutHistory,
    loading,
    error,
    hasMore,
    currentPage,
    totalPages,
    loadMore,
    refetch,
    goToPage
  }
}
