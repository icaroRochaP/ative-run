'use client'

import { useState, useMemo } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface Activity {
  id: number
  name: string
  type: string
  sport_type?: string
  start_date_local: string
  distance: number
  moving_time: number
}

interface WeeklyActivityCalendarProps {
  activities: Activity[]
  onActivityClick: (activity: Activity) => void
  className?: string
}

export function WeeklyActivityCalendar({ 
  activities, 
  onActivityClick, 
  className 
}: WeeklyActivityCalendarProps) {
  const [currentWeekStart, setCurrentWeekStart] = useState(() => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)
    return monday
  })

  const weekDays = useMemo(() => {
    const days = []
    for (let i = 0; i < 7; i++) {
      const day = new Date(currentWeekStart)
      day.setDate(currentWeekStart.getDate() + i)
      days.push(day)
    }
    return days
  }, [currentWeekStart])

  const activitiesByDay = useMemo(() => {
    const dayMap: Record<string, Activity[]> = {}
    
    activities.forEach(activity => {
      const activityDate = new Date(activity.start_date_local)
      const dateKey = activityDate.toDateString()
      
      if (!dayMap[dateKey]) {
        dayMap[dateKey] = []
      }
      dayMap[dateKey].push(activity)
    })
    
    return dayMap
  }, [activities])

  const goToPreviousWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() - 7)
    setCurrentWeekStart(newStart)
  }

  const goToNextWeek = () => {
    const newStart = new Date(currentWeekStart)
    newStart.setDate(currentWeekStart.getDate() + 7)
    setCurrentWeekStart(newStart)
  }

  const goToCurrentWeek = () => {
    const today = new Date()
    const dayOfWeek = today.getDay()
    const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
    const monday = new Date(today)
    monday.setDate(today.getDate() + mondayOffset)
    monday.setHours(0, 0, 0, 0)
    setCurrentWeekStart(monday)
  }

  const getActivityIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'run':
        return '🏃'
      case 'ride':
        return '🚴'
      case 'swim':
        return '🏊'
      case 'hike':
        return '🥾'
      case 'walk':
        return '🚶'
      default:
        return '💪'
    }
  }

  const getActivityColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'run':
        return 'bg-green-500'
      case 'ride':
        return 'bg-blue-500'
      case 'swim':
        return 'bg-cyan-500'
      case 'hike':
        return 'bg-amber-500'
      default:
        return 'bg-gray-500'
    }
  }

  const isToday = (date: Date) => {
    const today = new Date()
    return date.toDateString() === today.toDateString()
  }

  const formatWeekRange = () => {
    const endOfWeek = new Date(currentWeekStart)
    endOfWeek.setDate(currentWeekStart.getDate() + 6)
    
    const startMonth = currentWeekStart.toLocaleDateString('pt-BR', { month: 'short' })
    const endMonth = endOfWeek.toLocaleDateString('pt-BR', { month: 'short' })
    
    if (startMonth === endMonth) {
      return `${currentWeekStart.getDate()} - ${endOfWeek.getDate()} ${startMonth}`
    } else {
      return `${currentWeekStart.getDate()} ${startMonth} - ${endOfWeek.getDate()} ${endMonth}`
    }
  }

  return (
    <div className={cn("space-y-4", className)}>
      {/* Header com navegação */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={goToPreviousWeek}
            className="h-8 w-8 p-0"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          
          <div className="text-sm font-medium text-gray-700 min-w-[120px] text-center">
            {formatWeekRange()}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={goToNextWeek}
            className="h-8 w-8 p-0"
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        
        <Button
          variant="outline"
          size="sm"
          onClick={goToCurrentWeek}
          className="text-xs"
        >
          Hoje
        </Button>
      </div>

      {/* Calendário semanal */}
      <div className="grid grid-cols-7 gap-2">
        {weekDays.map((day, index) => {
          const dayActivities = activitiesByDay[day.toDateString()] || []
          const dayAbbr = day.toLocaleDateString('pt-BR', { weekday: 'short' })
          const dayNumber = day.getDate()
          const isCurrentDay = isToday(day)

          return (
            <div
              key={day.toISOString()}
              className="flex flex-col items-center space-y-2"
            >
              {/* Cabeçalho do dia */}
              <div className="text-center">
                <div className="text-xs font-medium text-gray-600 capitalize">
                  {dayAbbr}
                </div>
                <div
                  className={cn(
                    "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
                    isCurrentDay
                      ? "bg-orange-500 text-white"
                      : "text-gray-700"
                  )}
                >
                  {dayNumber}
                </div>
              </div>

              {/* Atividades do dia */}
              <div className="flex flex-col space-y-1 min-h-[40px] w-full">
                {dayActivities.slice(0, 3).map((activity, actIndex) => (
                  <button
                    key={activity.id}
                    onClick={() => onActivityClick(activity)}
                    className={cn(
                      "w-full text-xs p-1 rounded text-white hover:opacity-80 transition-opacity",
                      getActivityColor(activity.type)
                    )}
                    title={activity.name}
                  >
                    <div className="flex items-center justify-center space-x-1">
                      <span>{getActivityIcon(activity.type)}</span>
                    </div>
                  </button>
                ))}
                
                {dayActivities.length > 3 && (
                  <div className="text-xs text-gray-500 text-center">
                    +{dayActivities.length - 3}
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
