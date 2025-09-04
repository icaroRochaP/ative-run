"use client"

import Image from "next/image"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ResumoTab } from "@/components/dashboard/tabs/ResumoTab"
import { TreinoTab } from "@/components/dashboard/tabs/TreinoTab"
import { ProgressoTab } from "@/components/dashboard/tabs/ProgressoTab"
import { NutricaoTab } from "@/components/dashboard/tabs/NutricaoTab"
import { WeightUpdateModal } from "@/components/dashboard/modals/WeightUpdateModal"
import { WeeklyMealPlanModal } from "@/components/dashboard/modals/WeeklyMealPlanModal"
import { MealDetailModal } from "@/components/dashboard/modals/MealDetailModal"
import { ProfileModal } from "@/components/dashboard/modals/ProfileModal"
import { PasswordChangeModal } from "@/components/password-change-modal"
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton"
import { useDashboardData } from "@/hooks/dashboard/useDashboardData"
import { useWeightTracking } from "@/hooks/dashboard/useWeightTracking"
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
    showWeightUpdate,
    showWeeklyPlan,
    showProfileModal,
    showPasswordModal,
    selectedDay,
    currentHistoryPage,
    currentWeightPage,
    profile,
    setActiveTab,
    setSelectedWorkout,
    setSelectedHistoryWorkout,
    setSelectedMeal,
    setShowWeightUpdate,
    setShowWeeklyPlan,
    setSelectedDay,
    setCurrentHistoryPage,
    setCurrentWeightPage,
    handleLogout,
    handleProfileUpdate,
    handleOpenProfileModal,
    handleCloseProfileModal,
    handleOpenPasswordModal,
    handleClosePasswordModal,
  } = useDashboardData()

  const {
    weightUpdates,
    progressPhotos,
    currentWeight,
    targetWeight,
    startWeight,
    handleWeightUpdate,
  } = useWeightTracking()

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
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Resumo
            </TabsTrigger>
            <TabsTrigger
              value="training"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Treino
            </TabsTrigger>
            <TabsTrigger
              value="progress"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Progresso
            </TabsTrigger>
            <TabsTrigger
              value="nutrition"
              className="text-xs font-medium data-[state=active]:bg-gradient-to-r data-[state=active]:from-aleen-primary data-[state=active]:to-aleen-secondary data-[state=active]:text-white rounded-xl transition-all duration-300"
            >
              Nutrição
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="space-y-6">
            <ResumoTab
              user={user}
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
            <TreinoTab
              userId={profile?.id || ''}
            />
          </TabsContent>

          <TabsContent value="progress" className="space-y-6">
            <ProgressoTab
              currentWeight={currentWeight}
              targetWeight={targetWeight}
              startWeight={startWeight}
              weightUpdates={weightUpdates}
              progressPhotos={progressPhotos}
              onUpdateWeight={() => setShowWeightUpdate(true)}
              currentWeightPage={currentWeightPage}
              onWeightPageChange={setCurrentWeightPage}
            />
          </TabsContent>

          <TabsContent value="nutrition" className="space-y-6">
            <NutricaoTab
              userId={profile?.id || ''}
              dailyCalories={dailyNutrition.calories}
              protein={dailyNutrition.protein}
              carbs={dailyNutrition.carbs}
              fat={dailyNutrition.fat}
              todayMeals={todayMeals}
              onMealSelect={setSelectedMeal}
              onShowWeeklyPlan={() => setShowWeeklyPlan(true)}
              onConsumptionToggle={handleConsumptionToggle}
              loading={nutritionLoading}
              error={nutritionError}
              hasNoMealPlan={hasNoMealPlan}
            />
          </TabsContent>

          {/* Modals */}
          <WeightUpdateModal
            isOpen={showWeightUpdate}
            onClose={() => setShowWeightUpdate(false)}
            onSave={handleWeightUpdate}
          />

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
