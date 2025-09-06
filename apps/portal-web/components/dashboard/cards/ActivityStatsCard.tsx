import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Zap, Award } from "lucide-react"
import { ActivityStatsCardProps } from "@/types/dashboard"

export function ActivityStatsCard({ workoutsThisMonth, streakDays }: ActivityStatsCardProps) {
  return (
    <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center">
          <Zap className="mr-2 h-5 w-5 text-aleen-secondary" />
          Sua Atividade
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-4">
        <div className="text-center p-6 bg-gradient-to-br from-aleen-primary to-aleen-secondary rounded-2xl text-white shadow-lg">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Zap className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold">{workoutsThisMonth}</div>
          <div className="text-sm opacity-90">Treinos Este Mês</div>
        </div>
        <div className="text-center p-6 bg-gradient-to-br from-aleen-secondary to-aleen-purple rounded-2xl text-white shadow-lg">
          <div className="w-12 h-12 bg-white/20 backdrop-blur rounded-2xl flex items-center justify-center mx-auto mb-3">
            <Award className="h-6 w-6 text-white" />
          </div>
          <div className="text-2xl font-bold">{streakDays}</div>
          <div className="text-sm opacity-90">Dias Seguidos</div>
        </div>
      </CardContent>
    </Card>
  )
}
