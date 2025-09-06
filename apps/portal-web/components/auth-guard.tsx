"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { PasswordChangeModal } from "./password-change-modal"

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireOnboarding?: boolean
}

export function AuthGuard({ children, requireAuth = true, requireOnboarding = true }: AuthGuardProps) {
  const { user, profile, loading, refreshProfile } = useAuth()
  const router = useRouter()
  const [showPasswordModal, setShowPasswordModal] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (requireAuth && !user) {
        console.log("🔄 AuthGuard: No user, redirecting to signin")
        router.push("/auth/signin")
      } else if (!requireAuth && user) {
        console.log("🔄 AuthGuard: User exists but auth not required, redirecting to dashboard")
        router.push("/dashboard")
      } else if (user && requireOnboarding && profile) {
        // Priority 1: Check if user has completed onboarding
        if (profile.onboarding === false) {
          console.log("🔄 AuthGuard: User has not completed onboarding, redirecting to onboarding flow")
          router.push(`/onboarding/${user.id}`)
        } else if (profile.new_account === true) {
          // Priority 2: Check if user needs to change password (new_account = true)
          console.log("🔄 AuthGuard: User has new_account=true, password change required")
          setShowPasswordModal(true)
        } else {
          console.log("✅ AuthGuard: User has completed onboarding and password setup, allowing access")
          setShowPasswordModal(false)
        }
      } else if (user) {
        console.log("✅ AuthGuard: User authenticated, allowing access")
      }
    }
  }, [user, profile, loading, requireAuth, requireOnboarding, router])

  const handlePasswordChanged = async () => {
    console.log("🔄 AuthGuard: Password changed, refreshing profile...")
    setShowPasswordModal(false)
    // Refresh profile to get updated new_account status
    if (refreshProfile) {
      await refreshProfile()
    }
  }

  // If user needs to change password, show modal regardless of other conditions
  if (user && profile && profile.new_account === true) {
    return (
      <>
        {children}
        <PasswordChangeModal 
          isOpen={showPasswordModal} 
          onPasswordChanged={handlePasswordChanged}
        />
      </>
    )
  }

  if (loading) {
    console.log("⏳ AuthGuard: Loading...")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-aleen-light/40 border-t-4 border-t-aleen-primary"></div>
      </div>
    )
  }

  if (requireAuth && !user) {
    console.log("❌ AuthGuard: Auth required but no user")
    return null
  }

  if (!requireAuth && user) {
    console.log("🔄 AuthGuard: Auth not required but user exists")
    return null
  }

  // If user is authenticated but profile is still loading and onboarding is required, show loading
  if (user && !profile && requireOnboarding) {
    console.log("⏳ AuthGuard: User authenticated but profile loading...")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-aleen-light/40 border-t-4 border-t-aleen-primary"></div>
      </div>
    )
  }

  console.log("✅ AuthGuard: Rendering children")
  return <>{children}</>
}
