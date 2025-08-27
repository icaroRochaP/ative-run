import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CreditCard } from "lucide-react"
import { UserHeaderCard } from "@/components/dashboard/cards/UserHeaderCard"
import { ActivityStatsCard } from "@/components/dashboard/cards/ActivityStatsCard"
import { QuickActionsCard } from "@/components/dashboard/cards/QuickActionsCard"
import { ResumoTabProps } from "@/types/dashboard"

export function ResumoTab({ 
  user, 
  displayName, 
  initials, 
  nameLoading, 
  userData, 
  profile, 
  workoutsThisMonth, 
  streakDays,
  onProfileClick
}: ResumoTabProps) {
  return (
    <div className="space-y-6">
      {/* User Header */}
      <UserHeaderCard 
        user={user}
        displayName={displayName}
        initials={initials}
        nameLoading={nameLoading}
        onProfileClick={onProfileClick}
      />

      {/* Activity Stats */}
      <ActivityStatsCard 
        workoutsThisMonth={workoutsThisMonth}
        streakDays={streakDays}
      />

      {/* Quick Actions / Welcome Message */}
      <QuickActionsCard 
        userData={userData}
        profile={profile}
        displayName={displayName}
      />

      {/* Subscription Management */}
      <Card className="bg-white border-0 shadow-2xl rounded-3xl overflow-hidden">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center">
            <CreditCard className="mr-2 h-5 w-5 text-aleen-secondary" />
            Assinatura
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary text-white font-bold py-4 rounded-2xl shadow-lg transition-all duration-300 hover:scale-105">
            Atualizar Método de Pagamento
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
