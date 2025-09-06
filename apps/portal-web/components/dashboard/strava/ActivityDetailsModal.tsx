"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { 
  MapPin, 
  Clock, 
  Zap, 
  Heart, 
  Mountain, 
  Target, 
  TrendingUp,
  Calendar,
  Timer,
  Brain,
  AlertCircle,
  CheckCircle,
  ArrowUp,
  ArrowDown,
  Minus,
  Activity,
  Trophy,
  BarChart3
} from "lucide-react"

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
  ai_analysis?: any
  processed?: boolean
  created_at?: string
  updated_at?: string
  location_city?: string
  location_country?: string
  location_state?: string
  average_cadence?: number
  average_watts?: number
  max_watts?: number
  kilojoules?: number
}

interface ActivityDetailsModalProps {
  activity: StravaActivity | null
  isOpen: boolean
  onClose: () => void
}

export function ActivityDetailsModal({ activity, isOpen, onClose }: ActivityDetailsModalProps) {
  if (!activity) return null

  const formatDistance = (distance: number) => {
    return `${(distance / 1000).toFixed(2)} km`
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`
    }
    return `${minutes}m ${secs}s`
  }

  const formatSpeed = (speed: number) => {
    const kmh = speed * 3.6
    return `${kmh.toFixed(1)} km/h`
  }

  const formatPace = (speed: number) => {
    if (speed === 0) return "0:00 /km"
    const paceSeconds = 1000 / speed
    const minutes = Math.floor(paceSeconds / 60)
    const seconds = Math.floor(paceSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')} /km`
  }

  const getActivityTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      'Run': 'bg-green-100 text-green-800',
      'Ride': 'bg-blue-100 text-blue-800',
      'Walk': 'bg-yellow-100 text-yellow-800',
      'Swim': 'bg-cyan-100 text-cyan-800',
      'Hike': 'bg-orange-100 text-orange-800',
      'Workout': 'bg-purple-100 text-purple-800',
    }
    return colors[type] || 'bg-gray-100 text-gray-800'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center">
            <Target className="mr-2 h-6 w-6 text-aleen-primary" />
            {activity.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Header Info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Badge className={getActivityTypeColor(activity.type)}>
                {activity.sport_type || activity.type}
              </Badge>
              {activity.ai_analysis && (
                <Badge className="bg-purple-100 text-purple-800">
                  IA Analisada
                </Badge>
              )}
            </div>
            <div className="text-right">
              <div className="text-sm text-gray-500 flex items-center">
                <Calendar className="h-4 w-4 mr-1" />
                {new Date(activity.start_date_local).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {new Date(activity.start_date_local).toLocaleTimeString('pt-BR')}
              </div>
            </div>
          </div>

          {/* Location */}
          {(activity.location_city || activity.location_state || activity.location_country) && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2 text-aleen-primary" />
                  <span className="font-medium">
                    {[activity.location_city, activity.location_state, activity.location_country]
                      .filter(Boolean)
                      .join(', ')}
                  </span>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Main Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-aleen-primary" />
                <div className="text-2xl font-bold text-gray-800">{formatDistance(activity.distance)}</div>
                <div className="text-sm text-gray-500">Distância</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-8 w-8 mx-auto mb-2 text-aleen-primary" />
                <div className="text-2xl font-bold text-gray-800">{formatTime(activity.moving_time)}</div>
                <div className="text-sm text-gray-500">Tempo Ativo</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4 text-center">
                <Zap className="h-8 w-8 mx-auto mb-2 text-aleen-primary" />
                <div className="text-2xl font-bold text-gray-800">{formatSpeed(activity.average_speed)}</div>
                <div className="text-sm text-gray-500">Velocidade Média</div>
              </CardContent>
            </Card>

            {activity.total_elevation_gain > 0 && (
              <Card>
                <CardContent className="p-4 text-center">
                  <Mountain className="h-8 w-8 mx-auto mb-2 text-aleen-primary" />
                  <div className="text-2xl font-bold text-gray-800">{Math.round(activity.total_elevation_gain)}m</div>
                  <div className="text-sm text-gray-500">Elevação</div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {activity.elapsed_time !== activity.moving_time && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Timer className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <div className="font-medium">{formatTime(activity.elapsed_time)}</div>
                      <div className="text-xs text-gray-500">Tempo Total</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activity.type === 'Run' && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <div className="font-medium">{formatPace(activity.average_speed)}</div>
                      <div className="text-xs text-gray-500">Pace Médio</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activity.max_speed && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <div className="font-medium">{formatSpeed(activity.max_speed)}</div>
                      <div className="text-xs text-gray-500">Vel. Máxima</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activity.average_heartrate && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-500" />
                    <div>
                      <div className="font-medium">{Math.round(activity.average_heartrate)} bpm</div>
                      <div className="text-xs text-gray-500">FC Média</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activity.max_heartrate && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Heart className="h-5 w-5 mr-2 text-red-600" />
                    <div>
                      <div className="font-medium">{Math.round(activity.max_heartrate)} bpm</div>
                      <div className="text-xs text-gray-500">FC Máxima</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activity.average_cadence && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <TrendingUp className="h-5 w-5 mr-2 text-gray-500" />
                    <div>
                      <div className="font-medium">{Math.round(activity.average_cadence)} spm</div>
                      <div className="text-xs text-gray-500">Cadência</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activity.average_watts && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Zap className="h-5 w-5 mr-2 text-yellow-500" />
                    <div>
                      <div className="font-medium">{Math.round(activity.average_watts)}W</div>
                      <div className="text-xs text-gray-500">Potência Média</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {activity.kilojoules && (
              <Card>
                <CardContent className="p-3">
                  <div className="flex items-center">
                    <Target className="h-5 w-5 mr-2 text-orange-500" />
                    <div>
                      <div className="font-medium">{Math.round(activity.kilojoules)} kJ</div>
                      <div className="text-xs text-gray-500">Energia</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Social Stats */}
          <Card>
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3">Engajamento</h3>
              <div className="flex items-center space-x-6">
                <div className="flex items-center">
                  <span className="text-2xl mr-2">👏</span>
                  <div>
                    <div className="font-medium">{activity.kudos_count}</div>
                    <div className="text-xs text-gray-500">Kudos</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <span className="text-2xl mr-2">🏆</span>
                  <div>
                    <div className="font-medium">{activity.achievement_count}</div>
                    <div className="text-xs text-gray-500">Conquistas</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* AI Analysis */}
          <Card className="border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
            <CardContent className="p-6">
              <h3 className="font-bold text-xl mb-4 flex items-center text-purple-900">
                <Brain className="h-6 w-6 mr-3 text-purple-600" />
                Análise IA da Corrida
              </h3>
              
              {/* Performance Summary */}
              <div className="mb-6">
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                    <BarChart3 className="h-5 w-5 mr-2" />
                    Resumo da Performance
                  </h4>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {generatePerformanceSummary(activity)}
                  </p>
                  
                  {/* Performance Score */}
                  <div className="flex items-center justify-between bg-purple-100 rounded-lg p-3">
                    <span className="font-medium text-purple-900">Score de Performance</span>
                    <div className="flex items-center">
                      <div className="text-2xl font-bold text-purple-600 mr-2">
                        {calculatePerformanceScore(activity)}/100
                      </div>
                      <Trophy className="h-5 w-5 text-yellow-500" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Key Insights */}
              <div className="mb-6">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2" />
                  Insights Principais
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {generateInsights(activity).map((insight, index) => (
                    <div key={index} className={`bg-white rounded-lg p-4 border-l-4 ${insight.color}`}>
                      <div className="flex items-start">
                        <insight.icon className="h-5 w-5 mr-3 mt-0.5 flex-shrink-0" />
                        <div>
                          <h5 className="font-medium text-gray-900 mb-1">{insight.title}</h5>
                          <p className="text-sm text-gray-600">{insight.description}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Zone Analysis */}
              <div className="mb-6">
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <Activity className="h-5 w-5 mr-2" />
                  Análise de Zonas
                </h4>
                <div className="bg-white rounded-lg p-4 border border-purple-200">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {generateZoneAnalysis(activity).map((zone, index) => (
                      <div key={index} className="text-center">
                        <div className={`w-full h-2 rounded-full mb-2 ${zone.color}`}></div>
                        <div className="text-sm font-medium text-gray-900">{zone.name}</div>
                        <div className="text-xs text-gray-500">{zone.percentage}%</div>
                        <div className="text-xs text-gray-400">{zone.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Recommendations */}
              <div>
                <h4 className="font-semibold text-purple-900 mb-3 flex items-center">
                  <TrendingUp className="h-5 w-5 mr-2" />
                  Recomendações
                </h4>
                <div className="space-y-3">
                  {generateRecommendations(activity).map((rec, index) => (
                    <div key={index} className="bg-white rounded-lg p-4 border border-purple-200 flex items-start">
                      <rec.icon className={`h-5 w-5 mr-3 mt-0.5 flex-shrink-0 ${rec.iconColor}`} />
                      <div>
                        <h5 className="font-medium text-gray-900 mb-1">{rec.title}</h5>
                        <p className="text-sm text-gray-600">{rec.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Helper functions for AI Analysis
function generatePerformanceSummary(activity: StravaActivity): string {
  const formatDistance = (distance: number) => {
    const km = distance / 1000
    return `${km.toFixed(2)} km`
  }
  
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    
    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
    }
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
  
  const formatPace = (speed: number) => {
    if (speed === 0) return "0:00 /km"
    const paceSeconds = 1000 / speed
    const minutes = Math.floor(paceSeconds / 60)
    const seconds = Math.floor(paceSeconds % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const pace = formatPace(activity.average_speed)
  const distance = formatDistance(activity.distance)
  const time = formatTime(activity.moving_time)
  
  if (activity.type.toLowerCase() === 'run') {
    const paceNum = parseFloat(pace.split(':')[0]) + parseFloat(pace.split(':')[1]) / 60
    
    if (paceNum < 4.5) {
      return `Excelente corrida! Você manteve um ritmo forte de ${pace}/km por ${distance}. Sua resistência está em alta e você demonstrou boa capacidade anaeróbica nesta sessão.`
    } else if (paceNum < 5.5) {
      return `Ótima corrida de ritmo moderado! O pace de ${pace}/km por ${distance} indica um bom controle de esforço. Ideal para desenvolver resistência aeróbica.`
    } else {
      return `Corrida perfeita para base aeróbica! O ritmo confortável de ${pace}/km por ${distance} é excelente para construir resistência e recuperação ativa.`
    }
  }
  
  return `Atividade sólida de ${activity.sport_type || activity.type}! Você completou ${distance} em ${time}, mantendo boa consistência no esforço.`
}

function calculatePerformanceScore(activity: StravaActivity): number {
  let score = 70; // Base score
  
  if (activity.type.toLowerCase() === 'run') {
    const pace = activity.average_speed * 3.6 // Convert to km/h
    const distance = activity.distance / 1000 // Convert to km
    
    // Pace scoring (better pace = higher score)
    if (pace > 12) score += 15
    else if (pace > 10) score += 10
    else if (pace > 8) score += 5
    
    // Distance scoring
    if (distance > 10) score += 10
    else if (distance > 5) score += 5
    
    // Heart rate consistency (if available)
    if (activity.average_heartrate && activity.max_heartrate) {
      const hrVariability = (activity.max_heartrate - activity.average_heartrate) / activity.average_heartrate
      if (hrVariability < 0.3) score += 5 // Good HR control
    }
    
    // Elevation gain
    if (activity.total_elevation_gain > 100) score += 5
  }
  
  return Math.min(score, 95) // Cap at 95
}

interface Insight {
  title: string
  description: string
  icon: any
  color: string
}

function generateInsights(activity: StravaActivity): Insight[] {
  const insights: Insight[] = []
  const pace = activity.average_speed * 3.6
  const distance = activity.distance / 1000
  
  if (activity.type.toLowerCase() === 'run') {
    // Pace analysis
    if (pace > 12) {
      insights.push({
        title: "Ritmo Forte",
        description: "Você manteve um pace acelerado. Ótimo para desenvolver velocidade!",
        icon: ArrowUp,
        color: "border-green-500"
      })
    } else if (pace < 8) {
      insights.push({
        title: "Ritmo de Base",
        description: "Pace confortável, ideal para construir resistência aeróbica.",
        icon: CheckCircle,
        color: "border-blue-500"
      })
    }
    
    // Distance insights
    if (distance > 10) {
      insights.push({
        title: "Distância Longa",
        description: "Excelente trabalho de resistência. Sua base aeróbica está se fortalecendo!",
        icon: Target,
        color: "border-purple-500"
      })
    }
    
    // Heart rate insights
    if (activity.average_heartrate) {
      if (activity.average_heartrate > 160) {
        insights.push({
          title: "Zona Anaeróbica",
          description: "FC elevada indica treino de alta intensidade. Ótimo para VO2 max!",
          icon: Heart,
          color: "border-red-500"
        })
      } else if (activity.average_heartrate < 140) {
        insights.push({
          title: "Zona Aeróbica",
          description: "FC controlada, perfeita para base aeróbica e recuperação.",
          icon: Heart,
          color: "border-green-500"
        })
      }
    }
    
    // Elevation insights
    if (activity.total_elevation_gain > 200) {
      insights.push({
        title: "Treino de Subidas",
        description: "Bom ganho de elevação fortalece músculos e melhora potência.",
        icon: Mountain,
        color: "border-orange-500"
      })
    }
  }
  
  // Default insight if none generated
  if (insights.length === 0) {
    insights.push({
      title: "Atividade Consistente",
      description: "Você manteve um bom padrão de esforço durante toda a atividade.",
      icon: CheckCircle,
      color: "border-blue-500"
    })
  }
  
  return insights.slice(0, 4) // Max 4 insights
}

interface ZoneData {
  name: string
  percentage: number
  time: string
  color: string
}

function generateZoneAnalysis(activity: StravaActivity): ZoneData[] {
  // Mock zone distribution based on activity type and intensity
  const totalTime = activity.moving_time
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${minutes}:${secs.toString().padStart(2, '0')}`
  }
  
  if (activity.type.toLowerCase() === 'run') {
    const pace = activity.average_speed * 3.6
    
    if (pace > 12) {
      // Fast run - more in higher zones
      return [
        { name: "Z1 Recuperação", percentage: 10, time: formatTime(totalTime * 0.1), color: "bg-blue-400" },
        { name: "Z2 Aeróbica", percentage: 20, time: formatTime(totalTime * 0.2), color: "bg-green-400" },
        { name: "Z3 Tempo", percentage: 35, time: formatTime(totalTime * 0.35), color: "bg-yellow-400" },
        { name: "Z4 Limiar", percentage: 35, time: formatTime(totalTime * 0.35), color: "bg-orange-400" }
      ]
    } else if (pace > 10) {
      // Moderate run - balanced distribution
      return [
        { name: "Z1 Recuperação", percentage: 15, time: formatTime(totalTime * 0.15), color: "bg-blue-400" },
        { name: "Z2 Aeróbica", percentage: 45, time: formatTime(totalTime * 0.45), color: "bg-green-400" },
        { name: "Z3 Tempo", percentage: 30, time: formatTime(totalTime * 0.3), color: "bg-yellow-400" },
        { name: "Z4 Limiar", percentage: 10, time: formatTime(totalTime * 0.1), color: "bg-orange-400" }
      ]
    } else {
      // Easy run - mostly aerobic
      return [
        { name: "Z1 Recuperação", percentage: 30, time: formatTime(totalTime * 0.3), color: "bg-blue-400" },
        { name: "Z2 Aeróbica", percentage: 60, time: formatTime(totalTime * 0.6), color: "bg-green-400" },
        { name: "Z3 Tempo", percentage: 10, time: formatTime(totalTime * 0.1), color: "bg-yellow-400" },
        { name: "Z4 Limiar", percentage: 0, time: "0:00", color: "bg-orange-400" }
      ]
    }
  }
  
  // Default for other activities
  return [
    { name: "Baixa Int.", percentage: 40, time: formatTime(totalTime * 0.4), color: "bg-blue-400" },
    { name: "Mod. Int.", percentage: 45, time: formatTime(totalTime * 0.45), color: "bg-green-400" },
    { name: "Alta Int.", percentage: 15, time: formatTime(totalTime * 0.15), color: "bg-yellow-400" },
    { name: "Máx. Int.", percentage: 0, time: "0:00", color: "bg-orange-400" }
  ]
}

interface Recommendation {
  title: string
  description: string
  icon: any
  iconColor: string
}

function generateRecommendations(activity: StravaActivity): Recommendation[] {
  const recommendations: Recommendation[] = []
  const pace = activity.average_speed * 3.6
  const distance = activity.distance / 1000
  
  if (activity.type.toLowerCase() === 'run') {
    // Recovery recommendation
    if (pace > 12 || distance > 15) {
      recommendations.push({
        title: "Recuperação Ativa",
        description: "Após essa corrida intensa, faça uma caminhada leve de 20-30min nas próximas 24h para acelerar a recuperação.",
        icon: Heart,
        iconColor: "text-blue-500"
      })
    }
    
    // Training progression
    if (distance < 5) {
      recommendations.push({
        title: "Progressão de Volume",
        description: "Considere aumentar gradualmente a distância em 10% por semana para melhorar sua resistência.",
        icon: TrendingUp,
        iconColor: "text-green-500"
      })
    }
    
    // Pace work
    if (pace < 10) {
      recommendations.push({
        title: "Treino de Velocidade",
        description: "Inclua intervalados de 400m-800m uma vez por semana para melhorar seu pace.",
        icon: Zap,
        iconColor: "text-yellow-500"
      })
    }
    
    // Consistency
    recommendations.push({
      title: "Regularidade",
      description: "Mantenha 3-4 corridas por semana com pelo menos um dia de descanso entre treinos intensos.",
      icon: Calendar,
      iconColor: "text-purple-500"
    })
  }
  
  return recommendations.slice(0, 3) // Max 3 recommendations
}
