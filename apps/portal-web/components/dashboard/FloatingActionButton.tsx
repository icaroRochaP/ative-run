"use client"

import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { signOutClient } from "@/lib/auth"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"

interface FloatingActionButtonProps {
  onLogout?: () => void
}

export function FloatingActionButton({ onLogout }: FloatingActionButtonProps) {
  const { signOut } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    try {
      if (onLogout) {
        // allow caller to run custom logic first
        try {
          onLogout()
        } catch (err) {
          console.warn('FloatingActionButton: onLogout callback threw', err)
        }
      }

      // Prefer calling the Supabase client directly to clear the client session first.
      try {
        if (isSupabaseConfigured()) {
          const client = getSupabaseClient()
          await client.auth.signOut()
        } else {
          // Fallback: attempt signOutClient() if client getter isn't available
          await signOutClient()
        }
      } catch (clientErr) {
        console.warn('FloatingActionButton: client signOut failed:', clientErr)
      }

      // Do NOT call the server action signOut() from client code here.
      // Server action may attempt a global logout that requires a server-side session and
      // can produce 403/session_not_found when invoked from the browser.

      // If client signOut failed or returned an error, try to clear any persisted
      // Supabase auth tokens from localStorage as a best-effort fallback so the
      // AuthProvider will detect no user on reload.
      try {
        // Remove common Supabase localStorage keys (best-effort and safe)
        for (const key of Object.keys(window.localStorage)) {
          if (key.includes('supabase') || key.startsWith('sb-') || key.includes('auth')) {
            try {
              window.localStorage.removeItem(key)
            } catch (e) {
              // ignore
            }
          }
        }
      } catch (e) {
        console.warn('FloatingActionButton: error clearing localStorage fallback:', e)
      }

      // Force a full navigation so the app reloads and AuthProvider reads the cleared state.
      window.location.assign('/auth/signin')
    } catch (error) {
      console.error('Error during logout:', error)
    }
  }

  return (
    <div className="fixed bottom-6 right-6">
      <Button
        size="lg"
        onClick={handleLogout}
        className="rounded-full h-16 w-16 bg-gradient-to-r from-aleen-primary to-aleen-secondary hover:from-aleen-secondary hover:to-aleen-primary shadow-2xl border-0 transition-all duration-300 hover:scale-110"
        title="Sair"
      >
        <LogOut className="h-7 w-7 text-white" />
      </Button>
    </div>
  )
}
