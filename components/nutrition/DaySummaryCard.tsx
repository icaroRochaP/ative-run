'use client'

import { DayMealPlan } from "@/types/nutrition"
import { cn } from "@/lib/utils"

interface DaySummaryCardProps {
  dayData: DayMealPlan
  className?: string
}

const dayDisplayNames: Record<string, string> = {
  'segunda-feira': 'Segunda-feira',
  'terça-feira': 'Terça-feira',
  'quarta-feira': 'Quarta-feira',
  'quinta-feira': 'Quinta-feira',
  'sexta-feira': 'Sexta-feira',
  'sábado': 'Sábado',
  'domingo': 'Domingo'
}

export function DaySummaryCard({ dayData, className }: DaySummaryCardProps) {
  const displayName = dayDisplayNames[dayData.dayOfWeek] || dayData.dayName

  return (
    <div className={cn(
      "bg-white rounded-3xl p-6 text-center mx-4 mb-4 shadow-sm border border-gray-100",
      className
    )}>
      <div className="text-4xl font-bold text-green-600 mb-1">
        {dayData.totalCalories}
      </div>
      <div className="text-sm text-gray-600 font-medium mb-4">
        Calorias
      </div>
      <div className="flex justify-center space-x-6">
        <div className="text-center">
          <div className="text-lg font-bold text-blue-500">
            {dayData.totalProtein}g
          </div>
          <div className="text-xs text-gray-500">
            Proteína
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-500">
            {dayData.totalCarbs}g
          </div>
          <div className="text-xs text-gray-500">
            Carboidratos
          </div>
        </div>
        <div className="text-center">
          <div className="text-lg font-bold text-blue-500">
            {dayData.totalFat}g
          </div>
          <div className="text-xs text-gray-500">
            Gordura
          </div>
        </div>
      </div>
    </div>
  )
}
