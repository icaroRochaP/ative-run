import { ForgotPasswordForm } from "@/components/auth/forgot-password-form"
import { AuthGuard } from "@/components/auth-guard"
import { DebugPanel } from "@/components/debug-panel"

export default function ForgotPasswordPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ForgotPasswordForm />
        <DebugPanel />
      </div>
    </AuthGuard>
  )
}
