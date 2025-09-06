"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { LucideIcon, TrendingUp, TrendingDown, Minus } from "lucide-react"

interface MetricCardProps {
  title: string
  value: string
  description: string
  icon: LucideIcon
  trend?: string
  trendDirection?: "up" | "down" | "neutral"
}

export function MetricCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendDirection = "neutral"
}: MetricCardProps) {
  const getTrendIcon = () => {
    switch (trendDirection) {
      case "up":
        return <TrendingUp className="h-3 w-3" />
      case "down":
        return <TrendingDown className="h-3 w-3" />
      default:
        return <Minus className="h-3 w-3" />
    }
  }

  const getTrendColor = () => {
    switch (trendDirection) {
      case "up":
        return "text-green-600"
      case "down":
        return "text-red-600"
      default:
        return "text-gray-600"
    }
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        <div className="flex items-center justify-between">
          <p className="text-xs text-muted-foreground">{description}</p>
          {trend && (
            <div className={`flex items-center space-x-1 text-xs ${getTrendColor()}`}>
              {getTrendIcon()}
              <span>{trend}</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
