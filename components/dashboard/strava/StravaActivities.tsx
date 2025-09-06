'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/apps/portal-web/components/ui/card'
import { Badge } from '@/apps/portal-web/components/ui/badge'
import { Loader2, MapPin, Timer, Zap, Heart } from 'lucide-react'

interface StravaActivity {
  id: number
  name: string
  type: string
  distance: number
  moving_time: number
  elapsed_time: number
  total_elevation_gain: number
  start_date: string
  start_date_local: string
  average_speed: number
  max_speed: number
  average_heartrate?: number
  max_heartrate?: number
  kudos_count: number
  comment_count: number
}

interface StravaActivitiesProps {
  userId: string
  isConnected: boolean
}

export function StravaActivities({ userId, isConnected }: StravaActivitiesProps) {
  const [activities, setActivities] = useState<StravaActivity[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isConnected) {
      fetchActivities()
    } else {
      setIsLoading(false)
    }
  }, [userId, isConnected])

  const fetchActivities = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`/api/strava/activities?userId=${userId}&per_page=5`)
      
      if (response.ok) {
        const data = await response.json()
        setActivities(data.activities || [])
        setError(null)
      } else {
        throw new Error('Erro ao buscar atividades')
      }
    } catch (error) {
      console.error('Erro ao buscar atividades Strava:', error)
      setError('Erro ao carregar atividades')
    } finally {
      setIsLoading(false)
    }
  }

  const formatDistance = (meters: number) => {
    return (meters / 1000).toFixed(1) + ' km'
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatSpeed = (metersPerSecond: number) => {
    const kmh = metersPerSecond * 3.6
    return kmh.toFixed(1) + ' km/h'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    })
  }

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'run':
      case 'running':
        return 'bg-red-100 text-red-800'
      case 'ride':
      case 'cycling':
        return 'bg-blue-100 text-blue-800'
      case 'swim':
      case 'swimming':
        return 'bg-cyan-100 text-cyan-800'
      case 'walk':
      case 'walking':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isConnected) {
    return null
  }

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            Atividades Recentes
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-6">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="ml-2">Carregando atividades...</span>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
            <span className="text-white font-bold text-xs">S</span>
          </div>
          Atividades Recentes
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="text-center py-4 text-gray-500">
            {error}
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-4 text-gray-500">
            Nenhuma atividade encontrada
          </div>
        ) : (
          <div className="space-y-3">
            {activities.map((activity) => (
              <div key={activity.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm">{activity.name}</h4>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(activity.start_date_local)}</p>
                  </div>
                  <Badge className={getActivityTypeColor(activity.type)}>
                    {activity.type}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3 text-gray-400" />
                    <span>{formatDistance(activity.distance)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Timer className="h-3 w-3 text-gray-400" />
                    <span>{formatTime(activity.moving_time)}</span>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    <Zap className="h-3 w-3 text-gray-400" />
                    <span>{formatSpeed(activity.average_speed)}</span>
                  </div>
                  
                  {activity.average_heartrate && (
                    <div className="flex items-center gap-1">
                      <Heart className="h-3 w-3 text-red-400" />
                      <span>{Math.round(activity.average_heartrate)} bpm</span>
                    </div>
                  )}
                </div>
                
                {activity.total_elevation_gain > 0 && (
                  <div className="mt-2 text-xs text-gray-500">
                    Elevação: {Math.round(activity.total_elevation_gain)}m
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
