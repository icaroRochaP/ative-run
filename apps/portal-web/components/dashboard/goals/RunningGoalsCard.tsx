'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Target, Clock, MapPin, Activity, Plus } from 'lucide-react'

interface RunningGoal {
  id: number
  type: 'pace' | 'distance' | 'frequency' | 'time'
  title: string
  target: string | number
  current: string | number
  unit: string
  progress: number
  status: 'improving' | 'on-track' | 'good' | 'behind'
  targetDate?: string
  description?: string
}

interface RunningGoalsCardProps {
  userId?: string
}

export function RunningGoalsCard({ userId }: RunningGoalsCardProps) {
  const [goals, setGoals] = useState<RunningGoal[]>([
    {
      id: 1,
      type: 'pace',
      title: 'Pace 5km',
      target: '5:00',
      current: '5:45',
      unit: '/km',
      progress: 78,
      status: 'improving',
      targetDate: '2025-12-31',
      description: 'Melhorar o pace para corridas de 5km'
    },
    {
      id: 2,
      type: 'distance',
      title: 'Primeira 10km',
      target: 10,
      current: 8.5,
      unit: 'km',
      progress: 85,
      status: 'on-track',
      targetDate: '2025-10-15',
      description: 'Completar primeira corrida de 10km'
    },
    {
      id: 3,
      type: 'frequency',
      title: 'Regularidade',
      target: 4,
      current: 3.5,
      unit: 'corridas/semana',
      progress: 87,
      status: 'good',
      description: 'Manter consistência semanal'
    },
    {
      id: 4,
      type: 'time',
      title: 'Volume Mensal',
      target: '20:00',
      current: '16:30',
      unit: 'horas',
      progress: 82,
      status: 'on-track',
      targetDate: '2025-09-30',
      description: 'Alcançar 20 horas de corrida por mês'
    }
  ])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'on-track': return 'border-green-200 bg-gradient-to-br from-green-50 to-green-100'
      case 'improving': return 'border-blue-200 bg-gradient-to-br from-blue-50 to-blue-100'
      case 'good': return 'border-purple-200 bg-gradient-to-br from-purple-50 to-purple-100'
      case 'behind': return 'border-red-200 bg-gradient-to-br from-red-50 to-red-100'
      default: return 'border-gray-200 bg-gradient-to-br from-gray-50 to-gray-100'
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'on-track': return { text: 'No Ritmo', color: 'bg-green-100 text-green-800' }
      case 'improving': return { text: 'Progredindo', color: 'bg-blue-100 text-blue-800' }
      case 'good': return { text: 'Ótimo', color: 'bg-purple-100 text-purple-800' }
      case 'behind': return { text: 'Atrasado', color: 'bg-red-100 text-red-800' }
      default: return { text: 'Neutro', color: 'bg-gray-100 text-gray-800' }
    }
  }

  const getGoalIcon = (type: string) => {
    switch (type) {
      case 'pace': return Clock
      case 'distance': return MapPin
      case 'frequency': return Activity
      case 'time': return Clock
      default: return Target
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 90) return 'bg-green-600'
    if (progress >= 70) return 'bg-blue-600'
    if (progress >= 50) return 'bg-yellow-600'
    return 'bg-red-600'
  }

  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader className="bg-gradient-to-br from-blue-50 to-cyan-50 border-b border-blue-100">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center text-blue-900">
            <Target className="h-6 w-6 mr-3 text-blue-600" />
            Metas de Corrida
          </CardTitle>
          <Button size="sm" className="rounded-xl bg-blue-600 hover:bg-blue-700">
            <Plus className="h-4 w-4 mr-1" />
            Nova Meta
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {goals.map((goal) => {
            const badge = getStatusBadge(goal.status)
            const IconComponent = getGoalIcon(goal.type)
            
            return (
              <Card key={goal.id} className={`border-2 rounded-2xl ${getStatusColor(goal.status)}`}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center mr-3 shadow-sm">
                        <IconComponent className="h-5 w-5 text-gray-700" />
                      </div>
                      <h3 className="font-semibold text-gray-900">{goal.title}</h3>
                    </div>
                    <Badge className={`rounded-lg ${badge.color}`}>{badge.text}</Badge>
                  </div>

                  {goal.description && (
                    <p className="text-xs text-gray-600 mb-3">{goal.description}</p>
                  )}

                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Meta:</span>
                      <span className="font-medium">{goal.target} {goal.unit}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Atual:</span>
                      <span className="font-medium">{goal.current} {goal.unit}</span>
                    </div>
                    
                    {goal.targetDate && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Prazo:</span>
                        <span className="font-medium text-blue-600">
                          {new Date(goal.targetDate).toLocaleDateString('pt-BR')}
                        </span>
                      </div>
                    )}
                    
                    {goal.type === 'pace' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Falta melhorar:</span>
                        <span className="font-medium text-orange-600">45 segundos</span>
                      </div>
                    )}
                    
                    {goal.type === 'distance' && typeof goal.target === 'number' && typeof goal.current === 'number' && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Falta:</span>
                        <span className="font-medium text-orange-600">{goal.target - goal.current} km</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm text-gray-600">Progresso</span>
                      <span className="text-sm font-medium">{goal.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(goal.progress)}`}
                        style={{ width: `${goal.progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="mt-3 text-xs text-gray-500">
                    {goal.type === 'pace' && 'Estimativa: 6-8 semanas com treinos focados'}
                    {goal.type === 'distance' && 'Pronto para tentar nas próximas semanas!'}
                    {goal.type === 'frequency' && 'Mantenha a consistência atual'}
                    {goal.type === 'time' && 'Aumente gradualmente o volume semanal'}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
