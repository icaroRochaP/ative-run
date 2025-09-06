'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DaySelectorProps {
  selectedDay: string
  onDaySelect: (day: string) => void
  availableDays: string[]
  className?: string
  isLoading?: boolean
}

const dayLabels: Record<string, string> = {
  monday: 'Seg',
  tuesday: 'Ter', 
  wednesday: 'Qua',
  thursday: 'Qui',
  friday: 'Sex',
  saturday: 'Sáb',
  sunday: 'Dom'
}

export function DaySelector({ 
  selectedDay, 
  onDaySelect, 
  availableDays,
  className,
  isLoading = false
}: DaySelectorProps) {
  return (
    <div className={cn("flex flex-wrap justify-center items-center gap-3 px-2 py-2", className)}>
      {availableDays.map((day) => (
        <Button
          key={day}
          variant={selectedDay === day ? "default" : "outline"}
          size="sm"
          onClick={() => onDaySelect(day)}
          disabled={isLoading}
          className={cn(
            "text-sm font-semibold cursor-pointer transition-all duration-300 whitespace-nowrap rounded-2xl px-4 py-2.5 flex-shrink-0 shadow-md",
            selectedDay === day
              ? "bg-gradient-to-r from-aleen-primary to-aleen-secondary border-0 text-white hover:from-aleen-secondary hover:to-aleen-primary shadow-lg"
              : "bg-white border-2 border-aleen-light text-gray-700 hover:border-aleen-primary hover:bg-aleen-primary/10 hover:shadow-lg hover:scale-105",
            isLoading && "opacity-75 cursor-not-allowed"
          )}
        >
          {dayLabels[day] || day}
        </Button>
      ))}
    </div>
  )
}
