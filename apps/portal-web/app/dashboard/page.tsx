import { AuthGuard } from "@/components/auth-guard"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"

export default function DashboardPage() {
  return (
    <AuthGuard requireAuth={true} requireOnboarding={true}>
      <DashboardLayout />
    </AuthGuard>
  )
}