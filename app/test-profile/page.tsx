import { redirect } from "next/navigation"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AuthGuard } from "@/components/auth-guard"
import { getCurrentUser } from "@/app/auth-actions"

export default async function TestPage() {
  // Check authentication
  const user = await getCurrentUser()
  
  if (!user) {
    redirect("/auth/signin")
  }

  return (
    <AuthGuard>
      <DashboardLayout />
    </AuthGuard>
  )
}
