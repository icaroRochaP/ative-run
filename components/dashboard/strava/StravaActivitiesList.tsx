'use client'

import { useStravaActivities } from '@/hooks/useStravaActivities'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Loader2, MapPin, Clock, Zap, Heart, Activity, RefreshCw, ExternalLink } from 'lucide-react'
import { formatDistance, formatDuration, formatPace, formatDate } from '@/lib/utils'

interface StravaActivitiesListProps {
  userId: string
  limit?: number
  showHeader?: boolean
}

export function StravaActivitiesList({ 
  userId, 
  limit = 10, 
  showHeader = true 
}: StravaActivitiesListProps) {
  const {
    activities,
    isLoading,
    error,
    hasMore,
    loadMore,
    refresh,
    isConnected,
    checkConnection
  } = useStravaActivities({
    userId,
    perPage: limit,
    autoRefresh: false
  })

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            Atividades Strava
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Conecte sua conta Strava para ver suas atividades aqui.
              <Button variant="link" className="p-0 h-auto ml-2" asChild>
                <a href="/connect-strava">Conectar Strava</a>
              </Button>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              Atividades Strava
            </div>
            <Button variant="outline" size="sm" onClick={refresh}>
              <RefreshCw className="h-4 w-4" />
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      {showHeader && (
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white font-bold text-xs">S</span>
              </div>
              Atividades Strava
            </div>
            <Button variant="outline" size="sm" onClick={refresh} disabled={isLoading}>
              <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            </Button>
          </CardTitle>
        </CardHeader>
      )}
      
      <CardContent className="space-y-4">
        {isLoading && activities.length === 0 ? (
          <div className="flex items-center justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
            <span className="ml-2">Carregando atividades...</span>
          </div>
        ) : activities.length === 0 ? (
          <Alert>
            <Activity className="h-4 w-4" />
            <AlertDescription>
              Nenhuma atividade encontrada. Que tal fazer uma corrida hoje?
            </AlertDescription>
          </Alert>
        ) : (
          <>
            <div className="space-y-3">
              {activities.map((activity) => (
                <ActivityCard key={activity.id} activity={activity} />
              ))}
            </div>

            {hasMore && (
              <div className="flex justify-center pt-4">
                <Button 
                  variant="outline" 
                  onClick={loadMore} 
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Carregando...
                    </>
                  ) : (
                    'Carregar mais atividades'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function ActivityCard({ activity }: { activity: any }) {
  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'run':
        return '🏃'
      case 'ride':
        return '🚴'
      case 'swim':
        return '🏊'
      case 'hike':
        return '🥾'
      case 'walk':
        return '🚶'
      default:
        return '💪'
    }
  }

  const getActivityTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'run':
        return 'bg-green-100 text-green-800'
      case 'ride':
        return 'bg-blue-100 text-blue-800'
      case 'swim':
        return 'bg-cyan-100 text-cyan-800'
      case 'hike':
        return 'bg-amber-100 text-amber-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-lg">{getActivityIcon(activity.type)}</span>
            <h3 className="font-medium text-sm">{activity.name}</h3>
            <Badge variant="secondary" className={getActivityTypeColor(activity.type)}>
              {activity.sport_type || activity.type}
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{formatDistance(activity.distance)}</span>
            </div>
            
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{formatDuration(activity.moving_time)}</span>
            </div>
            
            {activity.type.toLowerCase() === 'run' && (
              <div className="flex items-center gap-1">
                <Zap className="h-3 w-3" />
                <span>{formatPace(activity.average_speed)} /km</span>
              </div>
            )}
            
            {activity.average_heartrate && (
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{Math.round(activity.average_heartrate)} bpm</span>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span>{formatDate(activity.start_date_local)}</span>
              {activity.location_city && (
                <span>{activity.location_city}</span>
              )}
            </div>
            
            <div className="flex items-center gap-2 text-xs text-gray-500">
              {activity.kudos_count > 0 && (
                <span>👍 {activity.kudos_count}</span>
              )}
              {activity.achievement_count > 0 && (
                <span>🏆 {activity.achievement_count}</span>
              )}
            </div>
          </div>
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="ml-2"
          asChild
        >
          <a 
            href={`https://www.strava.com/activities/${activity.id}`} 
            target="_blank" 
            rel="noopener noreferrer"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </div>
    </div>
  )
}