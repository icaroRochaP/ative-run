"use client"

import { UpdatePasswordForm } from "@/components/auth/update-password-form"
import { DebugPanel } from "@/components/debug-panel"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { getSupabaseClient } from "@/lib/supabase"

export default function UpdatePasswordPage() {
  const router = useRouter()

  useEffect(() => {
    // This effect runs on the client side to handle the URL fragment
    // Supabase's client will automatically parse the URL fragment and set the session
    // if it detects an access_token and refresh_token.
    // We don't need to manually parse window.location.hash here.

    const supabase = getSupabaseClient()

    // Listen for auth state changes to confirm session is set
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" && session) {
        console.log("✅ Session set after password reset link click. User:", session.user?.id)
        // Optionally, you could redirect here if you don't want them to see the form
        // router.push('/dashboard');
      } else if (event === "SIGNED_OUT") {
        console.log("User signed out during password reset flow.")
        // If for some reason the session is cleared, redirect to signin
        // router.push('/auth/signin');
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [router])

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <UpdatePasswordForm />
      <DebugPanel />
    </div>
  )
}
