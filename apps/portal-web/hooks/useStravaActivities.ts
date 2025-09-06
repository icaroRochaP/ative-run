import { useState, useEffect, useCallback } from 'react'

interface StravaActivity {
  id: number
  name: string
  type: string
  sport_type: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  average_speed: number
  max_speed: number
  average_heartrate?: number
  max_heartrate?: number
  start_date: string
  start_date_local: string
  achievement_count: number
  kudos_count: number
  location_city?: string
  location_state?: string
  location_country?: string
}

interface UseStravaActivitiesParams {
  userId: string
  page?: number
  perPage?: number
  after?: string
  before?: string
  autoRefresh?: boolean
}

interface UseStravaActivitiesReturn {
  activities: StravaActivity[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  loadMore: () => void
  refresh: () => void
  isConnected: boolean
  checkConnection: () => Promise<void>
}

export function useStravaActivities({
  userId,
  page = 1,
  perPage = 10,
  after,
  before,
  autoRefresh = false
}: UseStravaActivitiesParams): UseStravaActivitiesReturn {
  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(page)
  const [isConnected, setIsConnected] = useState(false)

  // Verificar se usuário tem Strava conectado
  const checkConnection = useCallback(async () => {
    try {
      const response = await fetch(`/api/strava/check-connection?userId=${userId}`)
      const data = await response.json()
      setIsConnected(data.connected)
      return data.connected
    } catch (error) {
      console.error('Erro ao verificar conexão Strava:', error)
      setIsConnected(false)
      return false
    }
  }, [userId])

  // Buscar atividades
  const fetchActivities = useCallback(async (pageNum: number = 1, append: boolean = false) => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      // Verificar conexão primeiro
      const connected = await checkConnection()
      if (!connected) {
        setError('Conta Strava não conectada')
        setIsLoading(false)
        return
      }

      const params = new URLSearchParams({
        userId,
        page: pageNum.toString(),
        per_page: perPage.toString()
      })

      if (after) params.set('after', after)
      if (before) params.set('before', before)

      const response = await fetch(`/api/strava/activities?${params.toString()}`)
      
      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Limite de requisições excedido. Tente novamente em alguns minutos.')
        }
        throw new Error('Erro ao buscar atividades')
      }

      const data = await response.json()
      
      if (append) {
        setActivities(prev => [...prev, ...data.data])
      } else {
        setActivities(data.data)
      }

      // Verificar se há mais páginas
      setHasMore(data.data.length === perPage)
      
    } catch (error) {
      console.error('Erro ao buscar atividades:', error)
      setError(error instanceof Error ? error.message : 'Erro desconhecido')
    } finally {
      setIsLoading(false)
    }
  }, [userId, perPage, after, before, checkConnection])

  // Carregar mais atividades
  const loadMore = useCallback(() => {
    if (!hasMore || isLoading) return
    
    const nextPage = currentPage + 1
    setCurrentPage(nextPage)
    fetchActivities(nextPage, true)
  }, [currentPage, hasMore, isLoading, fetchActivities])

  // Atualizar atividades
  const refresh = useCallback(() => {
    setCurrentPage(1)
    setActivities([])
    setHasMore(true)
    fetchActivities(1, false)
  }, [fetchActivities])

  // Carregar atividades iniciais
  useEffect(() => {
    if (userId) {
      fetchActivities(1, false)
    }
  }, [userId, fetchActivities])

  // Auto-refresh periódico
  useEffect(() => {
    if (!autoRefresh || !userId) return

    const interval = setInterval(() => {
      refresh()
    }, 5 * 60 * 1000) // 5 minutos

    return () => clearInterval(interval)
  }, [autoRefresh, userId, refresh])

  return {
    activities,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    isConnected,
    checkConnection
  }
}

// Hook para buscar uma atividade específica
export function useStravaActivity(userId: string, activityId: string) {
  const [activity, setActivity] = useState<StravaActivity | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId || !activityId) return

    const fetchActivity = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/strava/activities/${activityId}?userId=${userId}`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar atividade')
        }

        const data = await response.json()
        setActivity(data.data)
      } catch (error) {
        console.error('Erro ao buscar atividade:', error)
        setError(error instanceof Error ? error.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchActivity()
  }, [userId, activityId])

  return { activity, isLoading, error }
}

// Hook para estatísticas do atleta
export function useStravaStats(userId: string) {
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!userId) return

    const fetchStats = async () => {
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/strava/stats?userId=${userId}`)
        
        if (!response.ok) {
          throw new Error('Erro ao buscar estatísticas')
        }

        const data = await response.json()
        setStats(data.data)
      } catch (error) {
        console.error('Erro ao buscar estatísticas:', error)
        setError(error instanceof Error ? error.message : 'Erro desconhecido')
      } finally {
        setIsLoading(false)
      }
    }

    fetchStats()
  }, [userId])

  return { stats, isLoading, error }
}