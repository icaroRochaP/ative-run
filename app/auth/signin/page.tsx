import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthGuard } from "@/components/auth-guard"
import { DebugPanel } from "@/components/debug-panel"

export default function SignInPage() {
  return (
    <AuthGuard requireAuth={false}>
  <div className="min-h-screen bg-aleen-light flex items-center justify-center pt-0 px-4 pb-4">
        <SignInForm />
        <DebugPanel />
      </div>
    </AuthGuard>
  )
}
