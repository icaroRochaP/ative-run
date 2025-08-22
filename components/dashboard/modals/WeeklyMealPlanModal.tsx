"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { WeeklyMealPlanModalProps, MealPlan } from "@/types/dashboard"

export function WeeklyMealPlanModal({ isOpen, onClose, mealPlan, onMealSelect }: WeeklyMealPlanModalProps) {
  const [selectedDay, setSelectedDay] = useState("monday")

  if (!isOpen) return null

  const handleMealSelect = (meal: any) => {
    onMealSelect(meal)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 overflow-y-auto">
      <Card className="w-full max-w-md bg-white border-0 shadow-2xl rounded-3xl my-8">
        <CardHeader className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white rounded-t-3xl">
          <div className="flex items-center justify-between">
            <CardTitle className="text-white">Plano Semanal de Refeições</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white/80 hover:text-white hover:bg-white/20 rounded-xl"
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          {/* Day Selector */}
          <div className="mb-6">
            <div className="grid grid-cols-7 gap-1">
              {Object.entries(mealPlan).map(([key, dayData]) => (
                <Button
                  key={key}
                  variant={selectedDay === key ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedDay(key)}
                  className={
                    selectedDay === key
                      ? "bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white hover:from-aleen-primary/90 hover:to-aleen-secondary/90 text-xs p-2 rounded-xl border-0"
                      : "border-2 border-aleen-primary/20 text-aleen-primary hover:bg-aleen-primary/10 bg-transparent text-xs p-2 rounded-xl"
                  }
                >
                  {dayData.day.slice(0, 3)}
                </Button>
              ))}
            </div>
          </div>

          {/* Selected Day Details */}
          <div className="space-y-4">
            <div className="text-center p-6 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-3xl shadow-lg">
              <h3 className="text-xl font-bold text-white mb-1">
                {mealPlan[selectedDay as keyof typeof mealPlan].day}
              </h3>
              <div className="text-3xl font-bold text-white">
                {mealPlan[selectedDay as keyof typeof mealPlan].totalCalories} cal
              </div>
              <div className="text-sm text-white/80 font-medium">Calorias totais diárias</div>
            </div>

            {/* Meals for Selected Day */}
            <div className="space-y-3">
              {mealPlan[selectedDay as keyof typeof mealPlan].meals.map((meal, index) => (
                <Card
                  key={index}
                  className="bg-gradient-to-r from-aleen-light/50 to-white border-2 border-aleen-primary/20 cursor-pointer hover:border-aleen-primary/40 hover:shadow-lg transition-all duration-300 rounded-2xl"
                  onClick={() => handleMealSelect(meal)}
                >
                  <CardContent className="p-4">
                    <div className="flex justify-between items-center mb-3">
                      <h4 className="text-aleen-primary font-bold text-lg">{meal.meal}</h4>
                      <Badge className="bg-gradient-to-r from-aleen-primary to-aleen-secondary text-white border-0 rounded-xl px-3 py-1">
                        {meal.calories} cal
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-3 text-sm">
                      <div className="text-center p-2 bg-white/60 rounded-xl">
                        <div className="text-aleen-primary/70 font-medium">P</div>
                        <div className="text-aleen-primary font-bold">{meal.protein}</div>
                      </div>
                      <div className="text-center p-2 bg-white/60 rounded-xl">
                        <div className="text-aleen-secondary/70 font-medium">C</div>
                        <div className="text-aleen-secondary font-bold">{meal.carbs}</div>
                      </div>
                      <div className="text-center p-2 bg-white/60 rounded-xl">
                        <div className="text-aleen-purple/70 font-medium">G</div>
                        <div className="text-aleen-purple font-bold">{meal.fat}</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
