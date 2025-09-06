"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dumbbell, Calendar, ArrowLeft, ArrowRight } from "lucide-react"
import { useTrainingPlan } from "@/hooks/training/useTrainingPlan"
import { useWorkoutHistory } from "@/hooks/training/useWorkoutHistory"
import { useWorkoutTemplate } from "@/hooks/training/useWorkoutDetails"
import { TrainingPlanCard } from "@/components/dashboard/training/TrainingPlanCard"
import { WorkoutTemplateCard } from "@/components/dashboard/training/WorkoutTemplateCard"
import { WeeklyProgressIndicators } from "@/components/dashboard/training/WeeklyProgressIndicators"
import { WorkoutDetailModal } from "@/components/dashboard/training/WorkoutDetailModal"
import { WorkoutLogDetailModal } from "@/components/dashboard/training/WorkoutLogDetailModal"
import { WorkoutHistoryItem } from "@/components/dashboard/training/WorkoutHistoryItem"
import { EmptyTrainingState } from "@/components/dashboard/training/EmptyTrainingState"
import { TrainingPlanSkeleton, WorkoutCardSkeleton, WorkoutHistorySkeleton } from "@/components/dashboard/training/TrainingSkeletons"
import { TrainingErrorState } from "@/components/dashboard/training/TrainingErrorState"
import { StravaActivitiesList } from "@/components/dashboard/strava/StravaActivitiesList"

interface AtividadesTabProps {
  userId: string
}

export function AtividadesTab({ userId }: AtividadesTabProps) {
  // Training plan and schedule
  const {
    trainingPlan,
    weeklySchedule,
    loading: planLoading,
    error: planError,
    hasNoPlan,
    refetch: refetchPlan
  } = useTrainingPlan(userId)

  // Workout history
  const {
    workoutHistory,
    loading: historyLoading,
    error: historyError,
    currentPage,
    totalPages,
    goToPage,
    refetch: refetchHistory
  } = useWorkoutHistory(userId, { limit: 3 })

  // Modal states
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null)
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null)
  const [selectedWorkoutLogId, setSelectedWorkoutLogId] = useState<string | null>(null)

  // Workout template for modal
  const {
    workoutTemplate,
    loading: templateLoading,
    error: templateError
  } = useWorkoutTemplate(selectedTemplateId)

  const handleWorkoutSelect = (workoutTemplateId: string, completedToday: boolean) => {
    setSelectedTemplateId(workoutTemplateId)
  }

  const handleHistorySelect = (workoutLogId: string) => {
    setSelectedHistoryId(workoutLogId)
    setSelectedWorkoutLogId(workoutLogId)
  }

  const handleCloseWorkoutLogModal = () => {
    setSelectedWorkoutLogId(null)
    setSelectedHistoryId(null)
  }

  const handleStartWorkout = () => {
    // TODO: Implement workout starting functionality
    console.log('Starting workout:', selectedTemplateId)
    setSelectedTemplateId(null)
  }

  const handleFinishWorkout = () => {
    // Refresh data after workout completion
    refetchPlan()
    refetchHistory()
    setSelectedTemplateId(null)
  }

  const handleRetryPlan = () => {
    refetchPlan()
  }

  const handleRetryHistory = () => {
    refetchHistory()
  }

  return (
    <div className="space-y-6">
      {/* Training Plan Section */}
      <div>
        {planLoading ? (
          <TrainingPlanSkeleton />
        ) : planError ? (
          <TrainingErrorState 
            error={planError} 
            onRetry={handleRetryPlan}
            type="network"
          />
        ) : hasNoPlan ? (
          <EmptyTrainingState type="no-plan" />
        ) : (
          <>
            {trainingPlan && <TrainingPlanCard trainingPlan={trainingPlan} />}
            
            {weeklySchedule && (
              <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden mt-4">
                <CardHeader>
                  <CardTitle className="text-gray-800 flex items-center">
                    <Dumbbell className="mr-2 h-5 w-5 text-aleen-secondary" />
                    Treinos da Semana
                    {planLoading && (
                      <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-aleen-secondary"></div>
                    )}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Indicadores de progresso semanal */}
                  <WeeklyProgressIndicators 
                    workouts={weeklySchedule.workouts}
                    className="mb-4 border-b border-gray-100 pb-4"
                  />
                  
                  {/* Cards de treinos */}
                  <div className="space-y-4">
                    {weeklySchedule.workouts.map((workout) => (
                      <WorkoutTemplateCard
                        key={`${workout.day_of_week}-${workout.workout_template.id}`}
                        workout={workout}
                        onClick={() => handleWorkoutSelect(workout.workout_template.id, workout.completed_today)}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </>
        )}
      </div>

      {/* Training History Section */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <Calendar className="mr-2 h-5 w-5 text-aleen-secondary" />
            Histórico de Treinos
          </CardTitle>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <WorkoutHistorySkeleton />
          ) : historyError ? (
            <div className="text-center py-8">
              <TrainingErrorState 
                error={historyError} 
                onRetry={handleRetryHistory}
                type="server"
              />
            </div>
          ) : workoutHistory.length === 0 ? (
            <div className="py-4">
              <EmptyTrainingState type="no-history" />
            </div>
          ) : (
            <>
              <div className="space-y-3 mb-4">
                {workoutHistory.map((workoutLog) => (
                  <WorkoutHistoryItem
                    key={workoutLog.id}
                    workoutLog={workoutLog}
                    onDetailClick={handleHistorySelect}
                  />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex flex-col xs:flex-row justify-between items-center gap-3 xs:gap-0">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(Math.max(0, currentPage - 1))}
                    disabled={currentPage === 0 || historyLoading}
                    className="w-full xs:w-auto border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent disabled:opacity-50 rounded-2xl font-medium transition-all duration-300"
                  >
                    <ArrowLeft className="h-4 w-4 mr-1" />
                    <span className="hidden xs:inline">Anterior</span>
                    <span className="xs:hidden">Ant.</span>
                  </Button>
                  <span className="text-aleen-secondary text-sm font-medium px-4 py-2 bg-aleen-light rounded-xl">
                    {currentPage + 1} / {totalPages}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => goToPage(Math.min(totalPages - 1, currentPage + 1))}
                    disabled={currentPage >= totalPages - 1 || historyLoading}
                    className="w-full xs:w-auto border-2 border-aleen-secondary text-aleen-secondary hover:bg-aleen-secondary hover:text-white bg-transparent disabled:opacity-50 rounded-2xl font-medium transition-all duration-300"
                  >
                    <span className="hidden xs:inline">Próximo</span>
                    <span className="xs:hidden">Prox.</span>
                    <ArrowRight className="h-4 w-4 ml-1" />
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Strava Activities Section */}
      <StravaActivitiesList 
        userId={userId}
        limit={5}
        showHeader={true}
      />

      {/* Workout Detail Modal */}
      <WorkoutDetailModal
        workoutTemplate={workoutTemplate}
        isOpen={!!selectedTemplateId}
        onClose={() => setSelectedTemplateId(null)}
        onFinishWorkout={handleFinishWorkout}
        loading={templateLoading}
        error={templateError ? new Error(templateError) : null}
        completedToday={weeklySchedule?.workouts.find(w => 
          w.workout_template.id === selectedTemplateId
        )?.completed_today}
        userId={userId}
      />

      {/* Workout Log Detail Modal */}
      <WorkoutLogDetailModal
        workoutLogId={selectedWorkoutLogId}
        isOpen={!!selectedWorkoutLogId}
        onClose={handleCloseWorkoutLogModal}
      />
    </div>
  )
}
