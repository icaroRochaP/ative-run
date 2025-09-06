"use client"

import { useState, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, User, Settings } from "lucide-react"
import { StravaConnectCard } from "@/components/dashboard/strava/StravaConnectCard"
import { StravaActivities } from "@/components/dashboard/strava/StravaActivities"
import { Button } from "@/components/ui/button"

interface ResumoTabProps {
  profile: any | null
  displayName: string | null
  initials: string
  nameLoading: boolean
  userData: any
  workoutsThisMonth: number
  streakDays: number
  onProfileClick: () => void
}

export function ResumoTab({ 
  profile, 
  displayName, 
  initials, 
  nameLoading, 
  userData, 
  workoutsThisMonth, 
  streakDays,
  onProfileClick 
}: ResumoTabProps) {
  const [shouldRefreshActivities, setShouldRefreshActivities] = useState(false)

  // Debug log
  console.log("ResumoTab Debug:", { 
    profile, 
    displayName, 
    nameLoading, 
    userData,
    profileName: profile?.name,
    profileEmail: profile?.email,
    profileId: profile?.id
  })

  const handleConnectionChange = useCallback((isConnected: boolean) => {
    if (isConnected) {
      // Trigger activities refresh when connection is established
      setShouldRefreshActivities(true)
    }
  }, [])

  const handleActivitiesRefreshed = useCallback(() => {
    setShouldRefreshActivities(false)
  }, [])

  return (
    <div className="space-y-6">
      {/* User Profile Card */}
      <Card className="bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardContent className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-full flex items-center justify-center">
              {userData?.avatar_url ? (
                <img 
                  src={userData.avatar_url} 
                  alt="Avatar" 
                  className="w-16 h-16 rounded-full object-cover"
                />
              ) : (
                <span className="text-white text-xl font-bold">
                  {nameLoading ? "..." : initials}
                </span>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-800">
                {nameLoading ? "Carregando..." : displayName || profile?.name || profile?.email?.split('@')[0] || "Usuário"}
              </h2>
              <p className="text-gray-600 text-sm">{profile?.email || "Carregando..."}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onProfileClick}
              className="text-gray-600 hover:text-aleen-primary"
            >
              <Settings className="h-5 w-5" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Daily Stats Card */}
      <Card className="bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
          <CardTitle className="text-white flex items-center">
            <Target className="mr-2 h-5 w-5" />
            Resumo Diário
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6 p-6">
          {/* Grid de Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-4 bg-white rounded-2xl border-0 shadow-md">
              <div className="text-aleen-secondary text-sm mb-1 font-medium">Atividades</div>
              <div className="text-3xl font-bold text-gray-800">{workoutsThisMonth}</div>
              <div className="text-gray-500 text-xs">este mês</div>
            </div>
            <div className="text-center p-4 bg-white rounded-2xl border-0 shadow-md">
              <div className="text-aleen-secondary text-sm mb-1 font-medium">Streak</div>
              <div className="text-3xl font-bold text-gray-800">{streakDays}</div>
              <div className="text-gray-500 text-xs">dias</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Strava Connection */}
      <StravaConnectCard 
        userId={profile?.id || ''} 
        onConnectionChange={handleConnectionChange}
      />

      {/* Recent Activities */}
      <StravaActivities 
        userId={profile?.id || ''} 
        limit={5}
        shouldRefresh={shouldRefreshActivities}
        onRefreshComplete={handleActivitiesRefreshed}
      />
    </div>
  )
}