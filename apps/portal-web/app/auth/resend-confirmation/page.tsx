import { ResendConfirmationForm } from "@/components/auth/resend-confirmation-form"
import { AuthGuard } from "@/components/auth-guard"
import { DebugPanel } from "@/components/debug-panel"

export default function ResendConfirmationPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <ResendConfirmationForm />
        <DebugPanel />
      </div>
    </AuthGuard>
  )
}
