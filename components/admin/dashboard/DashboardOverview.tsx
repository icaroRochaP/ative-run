"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MetricCard } from "./MetricCard"
import { Users, Bot, DollarSign, TrendingUp, UserPlus } from "lucide-react"

export function DashboardOverview() {
  // Mock data for demonstration
  const metrics = {
    totalUsers: 1247,
    activeSubscriptions: 892,
    totalRevenue: 45780,
    monthlyGrowth: 12.5,
    newUsersThisMonth: 156,
    activeAgents: 8
  }

  return (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <MetricCard
          title="Total Users"
          value={metrics.totalUsers.toLocaleString()}
          description="Registered platform users"
          icon={Users}
          trend="+12.5%"
          trendDirection="up"
        />
        <MetricCard
          title="Active Subscriptions"
          value={metrics.activeSubscriptions.toLocaleString()}
          description="Current paying customers"
          icon={TrendingUp}
          trend="+8.2%"
          trendDirection="up"
        />
        <MetricCard
          title="Monthly Revenue"
          value={`$${metrics.totalRevenue.toLocaleString()}`}
          description="Current month earnings"
          icon={DollarSign}
          trend="+15.3%"
          trendDirection="up"
        />
        <MetricCard
          title="New Users (30d)"
          value={metrics.newUsersThisMonth.toLocaleString()}
          description="New registrations this month"
          icon={UserPlus}
          trend="+22.1%"
          trendDirection="up"
        />
        <MetricCard
          title="Active AI Agents"
          value={metrics.activeAgents.toString()}
          description="Currently deployed agents"
          icon={Bot}
          trend="Stable"
          trendDirection="neutral"
        />
        <MetricCard
          title="Growth Rate"
          value={`${metrics.monthlyGrowth}%`}
          description="Month-over-month growth"
          icon={TrendingUp}
          trend="+2.1%"
          trendDirection="up"
        />
      </div>
    </div>
  )
}
