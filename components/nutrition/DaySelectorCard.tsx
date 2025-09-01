'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { DaySelector } from "./DaySelector"

interface DaySelectorCardProps {
  selectedDay: string
  onDaySelect: (day: string) => void
  availableDays: string[]
  className?: string
  isLoading?: boolean
}

export function DaySelectorCard({ 
  selectedDay, 
  onDaySelect, 
  availableDays,
  className,
  isLoading = false
}: DaySelectorCardProps) {
  return (
    <Card className={`bg-gradient-to-br from-aleen-light to-white border-0 shadow-2xl rounded-3xl overflow-hidden ${className}`}>
      <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl pb-4">
        <CardTitle className="text-white flex items-center text-lg">
          <Calendar className="mr-3 h-5 w-5" />
          Navegue entre os dias da semana
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4 pb-6">
        <DaySelector
          selectedDay={selectedDay}
          onDaySelect={onDaySelect}
          availableDays={availableDays}
          className="px-0"
          isLoading={isLoading}
        />
      </CardContent>
    </Card>
  )
}
