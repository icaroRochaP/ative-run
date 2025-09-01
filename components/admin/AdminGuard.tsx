"use client"

import type React from "react"
import { useAuth } from "@/components/auth-provider"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface AdminGuardProps {
  children: React.ReactNode
}

export function AdminGuard({ children }: AdminGuardProps) {
  const { user, profile, loading } = useAuth()
  const router = useRouter()
  const [isAuthorized, setIsAuthorized] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        console.log("🔄 AdminGuard: No user, redirecting to signin")
        router.push("/auth/signin")
      } else if (profile) {
        // For now, we'll allow any authenticated user to access admin
        // In the future, this would check for admin role in profile
        console.log("✅ AdminGuard: User authenticated, allowing admin access")
        setIsAuthorized(true)
      }
    }
  }, [user, profile, loading, router])

  if (loading) {
    console.log("⏳ AdminGuard: Loading...")
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-4 border-aleen-light/40 border-t-4 border-t-aleen-primary"></div>
      </div>
    )
  }

  if (!user || !isAuthorized) {
    console.log("❌ AdminGuard: Not authorized for admin access")
    return null
  }

  console.log("✅ AdminGuard: Rendering admin panel")
  return <>{children}</>
}
