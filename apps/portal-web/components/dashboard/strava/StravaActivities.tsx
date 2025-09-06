"use client"

import { useState, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Activity, MapPin, Clock, Zap, Heart, RefreshCw } from "lucide-react"
import { ActivityDetailsModal } from "./ActivityDetailsModal"

interface StravaActivity {
  id: number
  name: string
  type: string
  sport_type?: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  average_speed: number
  max_speed?: number
  average_heartrate?: number
  max_heartrate?: number
  start_date: string
  start_date_local: string
  achievement_count: number
  kudos_count: number
  // Campos extras do cache local
  ai_analysis?: any
  processed?: boolean
  created_at?: string
  updated_at?: string
}

interface StravaActivitiesProps {
  userId: string
  limit?: number
  shouldRefresh?: boolean
  onRefreshComplete?: () => void
}

export function StravaActivities({ userId, limit = 5, shouldRefresh = false, onRefreshComplete }: StravaActivitiesProps) {
  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataSource, setDataSource] = useState<'cache' | 'api'>('cache')
  const [selectedActivity, setSelectedActivity] = useState<StravaActivity | null>(null)
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleActivityClick = (activity: StravaActivity) => {
    setSelectedActivity(activity)
    setIsModalOpen(true)
  }

  const handleCloseModal = () => {
    setIsModalOpen(false)
    setSelectedActivity(null)
  }

  useEffect(() => {
    if (userId) {
      fetchActivities()
    }
  }, [userId])

  // Efeito separado para refresh quando solicitado
  useEffect(() => {
    if (shouldRefresh && userId) {
      fetchActivities().then(() => {
        onRefreshComplete?.()
      })
    }
  }, [shouldRefresh, userId, onRefreshComplete])

    const fetchActivities = useCallback(async () => {
    if (!userId) return

    setIsLoading(true)
    setError(null)

    try {
      // SEMPRE usar atividades em cache (conforme PRD)
      console.log('📊 Buscando atividades do cache local...')
      
      const response = await fetch(`/api/strava/cached-activities?userId=${userId}&limit=${limit}&offset=0`)
      
      if (!response.ok) {
        throw new Error('Erro ao buscar atividades do cache')
      }

      const data = await response.json()
      console.log('✅ Atividades do cache carregadas:', data.activities?.length || 0)
      
      setActivities(data.activities || [])
    } catch (err) {
      console.error('❌ Erro ao buscar atividades:', err)
      setError('Erro ao carregar atividades. Tente novamente.')
      setActivities([])
    } finally {
      setIsLoading(false)
    }
  }, [userId])

  const toggleDataSource = () => {
    const newUseCache = dataSource === 'api'
    setDataSource(newUseCache ? 'cache' : 'api')
    
    // Re-fetch com nova fonte
    fetchActivities()
  }

  const formatDistance = (distance: number) => {
    return (distance / 1000).toFixed(2) + ' km'
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const remainingSeconds = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m ${remainingSeconds}s`
  }

  const formatSpeed = (speed: number) => {
    // Convert m/s to min/km pace
    const pace = 1000 / (speed * 60)
    const minutes = Math.floor(pace)
    const seconds = Math.floor((pace - minutes) * 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}/km`
  }

  const getActivityTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Run': 'bg-red-100 text-red-800',
      'Ride': 'bg-blue-100 text-blue-800',
      'Swim': 'bg-cyan-100 text-cyan-800',
      'Walk': 'bg-green-100 text-green-800',
      'Hike': 'bg-orange-100 text-orange-800',
      'Workout': 'bg-purple-100 text-purple-800'
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  // Se não há atividades, mostra estado vazio
  if (activities.length === 0 && !isLoading) {
    return (
      <Card className="bg-white border-0 shadow-lg rounded-2xl">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Activity className="h-5 w-5 text-blue-600" />
              Atividades Recentes
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Conecte sua conta Strava para ver suas atividades</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-white border-0 shadow-lg rounded-2xl">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-gray-800 flex items-center">
            <Activity className="mr-2 h-5 w-5 text-aleen-primary" />
            Atividades Recentes
          </CardTitle>
          <div className="flex items-center space-x-2">
            <Badge 
              variant={dataSource === 'cache' ? 'default' : 'secondary'}
              className={dataSource === 'cache' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}
            >
              {dataSource === 'cache' ? 'Cache Local' : 'API Strava'}
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={toggleDataSource}
              disabled={isLoading}
              className="h-8 px-3"
            >
              <RefreshCw className={`h-3 w-3 mr-1 ${isLoading ? 'animate-spin' : ''}`} />
              {dataSource === 'cache' ? 'Usar API' : 'Usar Cache'}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-aleen-primary mr-2" />
            <span className="text-gray-600">Carregando atividades...</span>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-600">
            <p>Erro ao carregar atividades: {error}</p>
            <Button 
              onClick={fetchActivities} 
              variant="outline" 
              className="mt-2"
            >
              Tentar Novamente
            </Button>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Activity className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Nenhuma atividade encontrada.</p>
            <p className="text-sm mt-1">
              {dataSource === 'cache' 
                ? 'Faça uma sincronização para salvar suas atividades localmente.'
                : 'Registre suas atividades no Strava para vê-las aqui.'
              }
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {activities.map((activity) => (
              <div
                key={activity.id}
                className="border rounded-xl p-4 hover:shadow-md transition-all cursor-pointer hover:border-aleen-primary"
                onClick={() => handleActivityClick(activity)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800 mb-1 hover:text-aleen-primary transition-colors">
                      {activity.name}
                    </h3>
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge className={getActivityTypeColor(activity.type)}>
                        {activity.sport_type || activity.type}
                      </Badge>
                      {dataSource === 'cache' && activity.ai_analysis && (
                        <Badge className="bg-purple-100 text-purple-800">
                          IA Analisada
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    <div className="text-xs text-aleen-primary mb-1">Clique para detalhes</div>
                    {new Date(activity.start_date_local).toLocaleDateString('pt-BR')}
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium">{formatDistance(activity.distance)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium">{formatTime(activity.moving_time)}</span>
                  </div>
                  
                  <div className="flex items-center">
                    <Zap className="h-4 w-4 mr-1 text-gray-400" />
                    <span className="font-medium">{formatSpeed(activity.average_speed)}</span>
                  </div>
                  
                  {activity.average_heartrate && (
                    <div className="flex items-center">
                      <Heart className="h-4 w-4 mr-1 text-red-400" />
                      <span className="font-medium">{Math.round(activity.average_heartrate)} bpm</span>
                    </div>
                  )}
                </div>

                {dataSource === 'cache' && activity.ai_analysis && (
                  <div className="mt-3 p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm text-purple-800 font-medium mb-1">Análise da IA:</p>
                    <p className="text-sm text-purple-700">{activity.ai_analysis.summary || 'Análise disponível'}</p>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3 pt-3 border-t">
                  <div className="flex items-center space-x-3 text-xs text-gray-500">
                    <span>👏 {activity.kudos_count}</span>
                    <span>🏆 {activity.achievement_count}</span>
                    {activity.total_elevation_gain > 0 && (
                      <span>⛰️ {Math.round(activity.total_elevation_gain)}m</span>
                    )}
                  </div>
                  
                  {dataSource === 'cache' && activity.updated_at && (
                    <div className="text-xs text-gray-400">
                      Cache: {new Date(activity.updated_at).toLocaleString('pt-BR')}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {/* Activity Details Modal */}
      <ActivityDetailsModal 
        activity={selectedActivity}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </Card>
  )
}
