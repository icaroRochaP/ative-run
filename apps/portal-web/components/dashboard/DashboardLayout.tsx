"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumoTab } from "@/components/dashboard/tabs/ResumoTab"
import { AtividadesTab } from "@/components/dashboard/tabs/AtividadesTab"
import { ProgressoTab } from "@/components/dashboard/tabs/MetasTab"
import { AnaliseTab } from "@/components/dashboard/tabs/AnaliseTab"
import { WeeklyMealPlanModal } from "@/components/dashboard/modals/WeeklyMealPlanModal"
import { MealDetailModal } from "@/components/dashboard/modals/MealDetailModal"
import { ProfileModal } from "@/components/dashboard/modals/ProfileModal"
import { PasswordChangeModal } from "@/components/password-change-modal"
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton"
import { useDashboardData } from "@/hooks/dashboard/useDashboardData"
import { useMealPlan } from "@/hooks/dashboard/useMealPlan"
import { useTrainingStats } from "@/hooks/training/useTrainingStats"

interface DashboardLayoutProps {
  // Add any additional props if needed
}

export function DashboardLayout(props: DashboardLayoutProps) {
  const {
    activeTab,
    userData,
    displayName,
    initials,
    nameLoading,
    user,
    workouts,
    workoutHistory,
    selectedWorkout,
    selectedHistoryWorkout,
    selectedMeal,
    showWeeklyPlan,
    showProfileModal,
    showPasswordModal,
    selectedDay,
    currentHistoryPage,
    profile,
    setActiveTab,
    setSelectedWorkout,
    setSelectedHistoryWorkout,
    setSelectedMeal,
    setShowWeeklyPlan,
    setSelectedDay,
    setCurrentHistoryPage,
    handleLogout,
    handleProfileUpdate,
    handleOpenProfileModal,
    handleCloseProfileModal,
    handleOpenPasswordModal,
    handleClosePasswordModal,
  } = useDashboardData()

  const {
    weeklyMealPlan,
    dailyNutrition,
    todayMeals,
    loading: nutritionLoading,
    error: nutritionError,
    hasNoMealPlan,
    handleConsumptionToggle,
  } = useMealPlan()

  const {
    workoutsThisMonth,
    streakDays,
    loading: statsLoading,
    error: statsError
  } = useTrainingStats(profile?.id || '')

  // Activity stats fallback values if there's an error
  const finalWorkoutsThisMonth = statsError ? 0 : workoutsThisMonth
  const finalStreakDays = statsError ? 0 : streakDays

  return (
    <div className="min-h-screen bg-gradient-to-br from-aleen-light to-white">
      <div className="container mx-auto px-4 py-6 max-w-md">
        {/* Header */}
        <div className="flex items-center justify-center mb-6">
          <div className="flex items-center justify-center">
            <div className="w-32 h-16 flex items-center justify-center">
              <Image
                src="/placeholder-logo.png"
                alt="Aleen.ai Logo"
                width={128}
                height={64}
              />
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-white border-0 shadow-xl rounded-2xl p-1">
            <TabsTrigger
              value="summary"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Início
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Atividades
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Metas
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-orange-500 data-[state=active]:to-orange-600 data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Análises
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <ResumoTab
              displayName={displayName}
              initials={initials}
              nameLoading={nameLoading}
              userData={userData}
              profile={profile}
              workoutsThisMonth={finalWorkoutsThisMonth}
              streakDays={finalStreakDays}
              onProfileClick={handleOpenProfileModal}
            />
          </TabsContent>

          <TabsContent value="training" className="space-y-6">
            <AtividadesTab
              userId={profile?.id || ''}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressoTab />
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <AnaliseTab
              userId={profile?.id || ''}
            />
          </TabsContent>

          {/* Modals */}
          <WeeklyMealPlanModal
            isOpen={showWeeklyPlan}
            onClose={() => setShowWeeklyPlan(false)}
            onMealSelect={setSelectedMeal}
            userId={profile?.id || ''}
          />

          <MealDetailModal
            meal={selectedMeal}
            onClose={() => setSelectedMeal(null)}
            onMarkConsumed={handleConsumptionToggle}
          />

          <ProfileModal
            isOpen={showProfileModal}
            onClose={handleCloseProfileModal}
            user={user}
            onProfileUpdate={handleProfileUpdate}
            onPasswordChange={handleOpenPasswordModal}
            onLogout={handleLogout}
          />

          <PasswordChangeModal
            isOpen={showPasswordModal}
            onPasswordChanged={handleClosePasswordModal}
            onClose={handleClosePasswordModal}
          />

          {/* Floating Action Button */}
          <FloatingActionButton onLogout={handleLogout} />
        </Tabs>
      </div>
    </div>
  )
}
