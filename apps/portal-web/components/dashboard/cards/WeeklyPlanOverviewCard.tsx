'use client'

import { Card, CardContent } from "@/components/ui/card"
import { Calendar, ChefHat, TrendingUp } from "lucide-react"
import { WeeklyMealPlan } from "@/types/nutrition"

interface WeeklyPlanOverviewCardProps {
  weeklyPlan: WeeklyMealPlan | null
  isLoading?: boolean
  onClick?: () => void
  className?: string
}

export function WeeklyPlanOverviewCard({ 
  weeklyPlan, 
  isLoading = false, 
  onClick,
  className 
}: WeeklyPlanOverviewCardProps) {
  if (isLoading) {
    return (
      <Card className={`bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-300 ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Plano Semanal</h3>
              <div className="space-y-2">
                <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse w-24"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse w-32"></div>
                <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full animate-pulse w-20"></div>
              </div>
            </div>
            <div className="text-aleen-primary">
              <Calendar className="h-10 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!weeklyPlan) {
    return (
      <Card 
        className={`bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-300 ${className}`}
        onClick={onClick}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="space-y-3">
              <h3 className="text-xl font-bold text-gray-800">Plano Semanal</h3>
              <div className="space-y-1">
                <p className="text-gray-600 font-medium">Nenhum plano ativo</p>
                <p className="text-aleen-primary font-semibold text-sm hover:text-aleen-secondary transition-colors">
                  Clique para criar
                </p>
              </div>
            </div>
            <div className="text-gray-400">
              <Calendar className="h-10 w-10" />
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  const daysWithPlan = Object.keys(weeklyPlan.days).length
  const totalDays = 7
  const totalMeals = Object.values(weeklyPlan.days).reduce(
    (acc, day) => acc + day.meals.length, 
    0
  )
  const avgCalories = Math.round(
    Object.values(weeklyPlan.days).reduce(
      (acc, day) => acc + day.totalCalories, 
      0
    ) / daysWithPlan
  )

  return (
    <Card 
      className={`bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden cursor-pointer hover:shadow-3xl transition-all duration-300 ${className}`}
      onClick={onClick}
    >
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-gray-800">Plano Semanal</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-aleen-primary" />
                <span className="text-base font-semibold text-gray-700">
                  {daysWithPlan}/{totalDays} dias
                </span>
              </div>
              <div className="flex items-center gap-3">
                <ChefHat className="h-4 w-4 text-aleen-secondary" />
                <span className="text-sm text-gray-600 font-medium">
                  {totalMeals} refeições
                </span>
              </div>
              <div className="flex items-center gap-3">
                <TrendingUp className="h-4 w-4 text-green-600" />
                <span className="text-sm text-gray-600 font-medium">
                  ~{avgCalories} kcal/dia
                </span>
              </div>
            </div>
          </div>
          <div className="text-aleen-primary">
            <Calendar className="h-10 w-10" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
