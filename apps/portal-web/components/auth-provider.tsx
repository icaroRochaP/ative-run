"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "@supabase/supabase-js"
import { getSupabaseClient, isSupabaseConfigured } from "@/lib/supabase"
import { getSessionClient } from "@/lib/auth" // Use client-side auth functions
import { signOut } from "@/app/auth-actions" // Import server action for signOut

type UserProfile = {
  id: string
  name?: string | null
  email?: string | null
  avatar_url?: string | null
  created_at?: string | null
  updated_at?: string | null
}

interface AuthContextType {
  user: User | null
  profile: UserProfile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  isConfigured: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
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
  const [initialized, setInitialized] = useState(false)

  useEffect(() => {
    if (initialized) return

    let isCancelled = false

    const initializeAuth = async () => {
      try {
        const isConfigured = isSupabaseConfigured()
        
        if (isCancelled) return
        setConfigured(isConfigured)

        if (!isConfigured) {
          console.warn("Supabase is not configured. Please add your environment variables.")
          if (!isCancelled) {
            setLoading(false)
            setInitialized(true)
          }
          return
        }

        const supabase = getSupabaseClient()

        // Get initial session
        const { user: initialUser } = await getSessionClient()
        console.log("🔍 AuthProvider: Initial session check", { user: initialUser?.id || 'none' })
        
        if (isCancelled) return
        setUser(initialUser)
        
        if (initialUser) {
          console.log("✅ AuthProvider: User found, creating profile from auth data...")
          const userProfile: UserProfile = {
            id: initialUser.id,
            name: initialUser.user_metadata?.display_name || initialUser.user_metadata?.name || initialUser.user_metadata?.full_name || null,
            email: initialUser.email || null,
            avatar_url: initialUser.user_metadata?.avatar_url || null,
            created_at: initialUser.created_at || null,
            updated_at: initialUser.updated_at || null,
          }
          
          if (!isCancelled) {
            setProfile(userProfile)
            console.log("✅ AuthProvider: Profile created", { userId: userProfile.id })
          }
        } else {
          console.log("❌ AuthProvider: No user found in session")
        }

        // Listen for auth changes
        const {
          data: { subscription },
        } = supabase.auth.onAuthStateChange(async (event, session) => {
          if (isCancelled) return
          
          setUser(session?.user ?? null)
          if (session?.user) {
            const userProfile: UserProfile = {
              id: session.user.id,
              name: session.user.user_metadata?.display_name || session.user.user_metadata?.name || session.user.user_metadata?.full_name || null,
              email: session.user.email || null,
              avatar_url: session.user.user_metadata?.avatar_url || null,
              created_at: session.user.created_at || null,
              updated_at: session.user.updated_at || null,
            }
            
            if (!isCancelled) {
              setProfile(userProfile)
            }
          } else {
            if (!isCancelled) {
              setProfile(null)
            }
          }
        })

        if (!isCancelled) {
          setLoading(false)
          setInitialized(true)
        }

        return () => {
          isCancelled = true
          subscription.unsubscribe()
        }
      } catch (error) {
        console.error("Error initializing auth:", error)
        if (!isCancelled) {
          setLoading(false)
          setInitialized(true)
        }
      }
    }

    const cleanup = initializeAuth()
    
    return () => {
      isCancelled = true
      cleanup?.then(cleanupFn => {
        if (cleanupFn && typeof cleanupFn === 'function') {
          cleanupFn()
        }
      })
    }
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

  const handleRefreshProfile = async () => {
    if (!configured || !user) return

    try {
      console.log("🔄 AuthProvider: Refreshing profile for user:", user.id)
      
      // Force refresh the current user to get latest metadata
      const supabase = getSupabaseClient()
      const { data: { user: refreshedUser }, error } = await supabase.auth.getUser()
      
      if (error || !refreshedUser) {
        console.error("❌ AuthProvider: Error getting refreshed user:", error)
        return
      }
      
      const userProfile: UserProfile = {
        id: refreshedUser.id,
        name: refreshedUser.user_metadata?.display_name || refreshedUser.user_metadata?.name || refreshedUser.user_metadata?.full_name || null,
        email: refreshedUser.email || null,
        avatar_url: refreshedUser.user_metadata?.avatar_url || null,
        created_at: refreshedUser.created_at || null,
        updated_at: refreshedUser.updated_at || null,
      }
      setProfile(userProfile)
      console.log("✅ AuthProvider: Profile refreshed", { userId: userProfile.id, name: userProfile.name })
    } catch (error) {
      console.error("❌ AuthProvider: Error refreshing profile:", error)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        loading,
        signOut: handleSignOut,
        refreshProfile: handleRefreshProfile,
        isConfigured: configured,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
