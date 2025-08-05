"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import { getUserProfileClient, getSessionClient } from "@/lib/auth" // Use client-side auth functions
import { signOut } from "@/app/auth-actions" // Import server action for signOut
import type { Database } from "@/lib/database.types"

type UserProfile = Database["public"]["Tables"]["users"]["Row"]

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  isConfigured: false,
})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [configured, setConfigured] = useState(false)

  useEffect(() => {
    const checkConfiguration = () => {
      const isConfigured = isSupabaseConfigured()
      setConfigured(isConfigured)

      if (!isConfigured) {
        console.warn("Supabase is not configured. Please add your environment variables.")
        setLoading(false)
        return
      }

      const supabase = getSupabaseClient() // Get client-side Supabase instance

      // Get initial session
      getSessionClient().then(({ user: initialUser }) => {
        setUser(initialUser)
        if (initialUser) {
          getUserProfileClient(initialUser.id).then(setProfile).catch(console.error)
        }
        setLoading(false)
      })

      // Listen for auth changes
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange(async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          try {
            const userProfile = await getUserProfileClient(session.user.id)
            setProfile(userProfile)
          } catch (error) {
            console.error("Error fetching user profile:", error)
            setProfile(null)
          }
        } else {
          setProfile(null)
        }
        setLoading(false)
      })

      return () => subscription.unsubscribe()
    }

    const cleanup = checkConfiguration()
    return cleanup
  }, [])

  const handleSignOut = async () => {
    if (!configured) return

    try {
      await signOut() // Call the server action for sign out
      // After server action, client-side auth state will update via onAuthStateChange
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
        isConfigured: configured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
