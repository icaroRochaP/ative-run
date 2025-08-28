'use client'

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface DaySelectorProps {
  selectedDay: string
  onDaySelect: (day: string) => void
  availableDays: string[]
  className?: string
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
  className 
}: DaySelectorProps) {
  return (
    <div className={cn("flex flex-wrap justify-center items-center gap-2 px-4 py-4", className)}>
      {availableDays.map((day) => (
        <Button
          key={day}
          variant={selectedDay === day ? "default" : "outline"}
          size="sm"
          onClick={() => onDaySelect(day)}
          className={cn(
            "text-sm font-medium cursor-pointer transition-all duration-200 whitespace-nowrap rounded-3xl px-4 py-2 flex-shrink-0",
            selectedDay === day
              ? "bg-aleen-primary border-aleen-primary text-white hover:bg-aleen-primary/90"
              : "bg-slate-50 border-2 border-slate-200 text-slate-700 hover:border-aleen-primary hover:bg-aleen-primary/10"
          )}
        >
          {dayLabels[day] || day}
        </Button>
      ))}
    </div>
  )
}
