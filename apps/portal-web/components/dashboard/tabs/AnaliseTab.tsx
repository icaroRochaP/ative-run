'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  TrendingUp, 
  Calendar, 
  BarChart3, 
  Activity, 
  Clock, 
  MapPin, 
  Zap,
  Trophy,
  Brain,
  CheckCircle,
  ArrowUp,
  Heart,
  AlertTriangle
} from 'lucide-react'
import { useStravaActivities } from '@/hooks/useStravaActivities'
import { 
  AnalysisHeaderSkeleton, 
  AnalysisTabsSkeleton, 
  AnalysisProfileSkeleton,
  AnalysisPerformanceSkeleton,
  AnalysisTrendsSkeleton
} from '@/components/dashboard/analysis/AnalysisSkeletons'

interface AnaliseTabProps {
  userId: string
}

export function AnaliseTab({ userId }: AnaliseTabProps) {
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month')
  
  const {
    activities,
    isLoading,
    error
  } = useStravaActivities({
    userId,
    perPage: 50,
    autoRefresh: false
  })

  // Filter activities for running
  const runningActivities = activities.filter(activity => 
    activity.type.toLowerCase() === 'run'
  )

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <AnalysisHeaderSkeleton />
        <AnalysisTabsSkeleton />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600">Erro ao carregar dados: {error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Card */}
            {/* Main Header */}
      <Card className="bg-gradient-to-br from-indigo-600 via-purple-600 to-purple-700 border-0 shadow-2xl rounded-3xl overflow-hidden text-white">
        <CardContent className="p-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Análise de Performance</h1>
              <p className="text-purple-100 text-lg">
                Insights detalhados sobre seus treinos e evolução
              </p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-bold mb-1">{runningActivities.length}</div>
              <div className="text-purple-200 text-sm">Corridas este mês</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-3 bg-gray-100 rounded-2xl p-1">
          <TabsTrigger value="overview" className="rounded-xl">Perfil do Atleta</TabsTrigger>
          <TabsTrigger value="performance" className="rounded-xl">Performance</TabsTrigger>
          <TabsTrigger value="trends" className="rounded-xl">Tendências</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6 mt-6">
          {/* Athlete Profile Summary */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 border-b border-blue-100">
              <CardTitle className="flex items-center text-blue-900">
                <Trophy className="h-6 w-6 mr-3 text-blue-600" />
                Perfil do Corredor - Análise IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Nível Atual</h4>
                    <Badge className="bg-blue-100 text-blue-800 rounded-lg text-xs">Intermediário+</Badge>
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Baseado em pace médio, consistência e volume semanal
                  </p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-blue-600 mr-2">7.2</span>
                    <span className="text-sm text-gray-500">/10</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Especialidade</h4>
                    <Heart className="h-5 w-5 text-red-500" />
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Resistência e corridas de média distância (5-15km)
                  </p>
                  <Badge className="bg-green-100 text-green-800 rounded-lg text-xs">Resistência</Badge>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Consistência</h4>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Frequência de treinos nas últimas 4 semanas
                  </p>
                  <div className="flex items-center">
                    <span className="text-2xl font-bold text-green-600 mr-2">85</span>
                    <span className="text-sm text-gray-500">%</span>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-4 border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 text-sm">Zona de Risco</h4>
                    <AlertTriangle className="h-5 w-5 text-yellow-500" />
                  </div>
                  <p className="text-xs text-gray-600 mb-3">
                    Risco de lesão baseado em volume e intensidade
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800 rounded-lg text-xs">Baixo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Performance Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {runningActivities.length > 0 ? 
                    Math.round(runningActivities.reduce((sum, a) => sum + a.distance, 0) / 1000) : 0
                  } km
                </div>
                <div className="text-sm text-gray-500 mb-2">Total Percorrido</div>
                <div className="text-xs text-green-600 font-medium">+12% vs mês anterior</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="h-6 w-6 text-purple-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">5:45</div>
                <div className="text-sm text-gray-500 mb-2">Pace Médio</div>
                <div className="text-xs text-green-600 font-medium">-8s vs mês anterior</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Activity className="h-6 w-6 text-green-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">{runningActivities.length}</div>
                <div className="text-sm text-gray-500 mb-2">Corridas</div>
                <div className="text-xs text-green-600 font-medium">+2 vs mês anterior</div>
              </CardContent>
            </Card>

            <Card className="bg-white border-0 shadow-lg rounded-2xl hover:shadow-xl transition-all duration-300">
              <CardContent className="p-6 text-center">
                <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="h-6 w-6 text-orange-600" />
                </div>
                <div className="text-2xl font-bold text-gray-800 mb-1">
                  {runningActivities.length > 0 ? 
                    Math.round(runningActivities.reduce((sum, a) => sum + a.moving_time, 0) / 3600) : 0
                  }h
                </div>
                <div className="text-sm text-gray-500 mb-2">Tempo Total</div>
                <div className="text-xs text-green-600 font-medium">+1.5h vs mês anterior</div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-br from-purple-50 to-indigo-50 border-b border-purple-100">
              <CardTitle className="flex items-center text-purple-900">
                <Brain className="h-6 w-6 mr-3 text-purple-600" />
                Insights da IA
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-200">
                  <h4 className="font-semibold text-green-900 mb-2 flex items-center text-sm">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    Pontos Fortes
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Excelente consistência nos treinos</li>
                    <li>• Boa progressão no pace médio</li>
                    <li>• Resistência aeróbica sólida</li>
                    <li>• Recuperação adequada entre sessões</li>
                  </ul>
                </div>

                <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-4 border border-orange-200">
                  <h4 className="font-semibold text-orange-900 mb-2 flex items-center text-sm">
                    <TrendingUp className="h-5 w-5 mr-2 text-orange-600" />
                    Oportunidades
                  </h4>
                  <ul className="text-xs text-gray-700 space-y-1">
                    <li>• Incluir treinos de velocidade</li>
                    <li>• Variar tipos de treino</li>
                    <li>• Aumentar volume gradualmente</li>
                    <li>• Focar em treinos de força</li>
                  </ul>
                </div>
              </div>

              <div className="mt-6 bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-4 border border-purple-200">
                <h4 className="font-semibold text-purple-900 mb-2 text-sm">Recomendação da Semana</h4>
                <p className="text-xs text-gray-700">
                  Com base no seu progresso consistente, recomendo incluir 1 treino de intervalados por semana 
                  (ex: 6x400m) para melhorar sua velocidade e potência anaeróbica. Mantenha o volume atual 
                  e foque na qualidade dos treinos.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

                <TabsContent value="performance" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 p-6 rounded-3xl border border-blue-100">
            {isLoading ? (
              <AnalysisPerformanceSkeleton />
            ) : (
              <div className="text-center text-gray-600">
                <Activity className="h-12 w-12 mx-auto mb-4 text-blue-600" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Análise de Performance</h3>
                <p className="text-sm">Estatísticas detalhadas de rendimento em breve</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="trends" className="space-y-6 mt-6">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-3xl border border-green-100">
            {isLoading ? (
              <AnalysisTrendsSkeleton />
            ) : (
              <div className="text-center text-gray-600">
                <TrendingUp className="h-12 w-12 mx-auto mb-4 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Tendências</h3>
                <p className="text-sm">Gráficos de evolução e tendências em breve</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Helper Components
function PerformanceAnalysis({ activities, period }: { activities: any[], period: string }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl">Análise de Performance Detalhada</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-semibold">Evolução do Pace</h4>
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <span className="text-gray-500">Gráfico de Evolução de Pace</span>
              </div>
              <div className="text-sm text-gray-600">
                Melhoria de 12 segundos no pace médio nos últimos 30 dias
              </div>
            </div>
            
            <div className="space-y-4">
              <h4 className="font-semibold">Distribuição de Intensidade</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Baixa (Recuperação)</span>
                  <span className="text-sm font-medium">35%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: '35%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Moderada (Aeróbica)</span>
                  <span className="text-sm font-medium">50%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: '50%' }}></div>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-sm">Alta (Anaeróbica)</span>
                  <span className="text-sm font-medium">15%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: '15%' }}></div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function TrendsAnalysis({ activities, period }: { activities: any[], period: string }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white border-0 shadow-2xl rounded-3xl">
        <CardHeader>
          <CardTitle className="text-xl">Tendências de Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold mb-4">Volume Semanal</h4>
              <div className="h-32 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex items-center justify-center border border-gray-200">
                <span className="text-gray-500">Gráfico de Volume Semanal</span>
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Crescimento consistente de 8% ao mês
              </div>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Consistência</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm">Frequência Semanal:</span>
                  <span className="font-medium">3.5 corridas</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Maior Streak:</span>
                  <span className="font-medium text-green-600">12 dias</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm">Regularidade:</span>
                  <span className="font-medium">88%</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
