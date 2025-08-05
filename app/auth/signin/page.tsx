import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthGuard } from "@/components/auth-guard"
import { DebugPanel } from "@/components/debug-panel"

export default function SignInPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <SignInForm />
        <DebugPanel />
      </div>
    </AuthGuard>
  )
}
