"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Activity } from "lucide-react"
import { useStravaActivities } from "@/hooks/useStravaActivities"
import { WeeklyActivityCalendar } from "@/components/dashboard/strava/WeeklyActivityCalendar"
import { StravaActivitiesList } from "@/components/dashboard/strava/StravaActivitiesList"
import { ActivityDetailsModal } from "@/components/dashboard/strava/ActivityDetailsModal"

interface AtividadesTabProps {
  userId: string
}

export function AtividadesTab({ userId }: AtividadesTabProps) {
  const [selectedActivity, setSelectedActivity] = useState<any>(null)
  
  const {
    activities,
    isLoading,
    error,
    isConnected
  } = useStravaActivities({
    userId,
    perPage: 50, // Pegar mais atividades para o calendário
    autoRefresh: false
  })

  const handleActivityClick = (activity: any) => {
    setSelectedActivity(activity)
  }

  const handleCloseModal = () => {
    setSelectedActivity(null)
  }

  if (!isConnected) {
    return (
      <div className="space-y-6">
        <StravaActivitiesList 
          userId={userId}
          limit={5}
          showHeader={true}
          onActivityClick={handleActivityClick}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Calendário Semanal de Atividades */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center mr-2">
              <span className="text-white font-bold text-xs">S</span>
            </div>
            Atividades da Semana
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-orange-500"></div>
              <span className="ml-2 text-gray-600">Carregando atividades...</span>
            </div>
          ) : error ? (
            <div className="text-center py-8 text-gray-500">
              <Activity className="h-8 w-8 mx-auto mb-2 opacity-50" />
              <p>Erro ao carregar atividades</p>
            </div>
          ) : (
            <WeeklyActivityCalendar
              activities={activities}
              onActivityClick={handleActivityClick}
            />
          )}
        </CardContent>
      </Card>

      {/* Lista de Atividades Recentes */}
      <StravaActivitiesList 
        userId={userId}
        limit={10}
        showHeader={true}
        onActivityClick={handleActivityClick}
      />

      {/* Modal de Detalhes da Atividade */}
      <ActivityDetailsModal
        activity={selectedActivity}
        isOpen={!!selectedActivity}
        onClose={handleCloseModal}
      />
    </div>
  )
}
