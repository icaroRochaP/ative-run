"use client"

import { SignInForm } from "@/components/auth/sign-in-form"
import { AuthGuard } from "@/components/auth-guard"

export default function LoginPage() {
  return (
    <AuthGuard requireAuth={false}>
      <div className="min-h-screen bg-gradient-to-br from-aleen-light to-white flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <SignInForm />
        </div>
      </div>
    </AuthGuard>
  )
}
