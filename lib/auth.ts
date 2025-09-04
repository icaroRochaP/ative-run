import { getSupabaseClient, isSupabaseConfigured } from "./supabase"
import type { Database } from "./database.types"

export type User = Database["public"]["Tables"]["users"]["Row"]

// This signUp function is for client-side use if you have a separate sign-up form
// For the onboarding flow, signUpAndCreateProfile server action is preferred.
export const signUp = async (email: string, password: string, userData: Partial<User>) => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured")
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData,
    },
  })

  if (error) throw error

  // Create user profile in users table (this part might be redundant if using server actions for profile creation)
  if (data.user) {
    const { error: profileError } = await supabase.from("users").insert({
      id: data.user.id,
      email: data.user.email!,
      name: userData.name || "",
      onboarding: false,
    })

    if (profileError) throw profileError
  }

  return data
}

// Função para finalizar onboarding (client-side, if needed, but server action is also available)
// This function is now also available as a server action in app/auth-actions.ts
// Keeping it here for client-side direct calls if necessary, but app/page.tsx uses the server action.
export const completeOnboardingClient = async (userId: string, userData: Partial<User>) => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured")
  }

  const supabase = getSupabaseClient()

  const { error } = await supabase
    .from("users")
    .update({
      ...userData,
      onboarding: true,
      updated_at: new Date().toISOString(),
    })
    .eq("id", userId)

  if (error) throw error
}

export const signInClient = async (email: string, password: string) => {
  if (!isSupabaseConfigured()) {
    throw new Error("Supabase is not configured")
  }

  const supabase = getSupabaseClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) throw error
  return data
}

// Client-side sign out (if needed, otherwise use server action)
export const signOutClient = async () => {
  if (!isSupabaseConfigured()) {
    return
  }
  const supabase = getSupabaseClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

// Client-side get session (for AuthProvider)
export const getSessionClient = async () => {
  if (!isSupabaseConfigured()) {
    return { session: null, user: null }
  }
  const supabase = getSupabaseClient()
  const {
    data: { session },
    error,
  } = await supabase.auth.getSession()
  if (error) {
    console.error("Error getting session client-side:", error)
    return { session: null, user: null }
  }
  return { session, user: session?.user || null }
}

// Client-side get user profile (if needed, otherwise use server action)
// This might be redundant if profile is always fetched via server action or context
export const getUserProfileClient = async (userId: string) => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase is not configured when getting user profile")
    // Em desenvolvimento, retornar um perfil mock para não quebrar a UI
    if (process.env.NODE_ENV === 'development') {
      console.log("DEV MODE: Returning mock profile for", userId)
      return {
        id: userId,
        email: "dev@example.com",
        name: "Dev User",
        onboarding: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    throw new Error("Supabase is not configured")
  }
  
  try {
    const supabase = getSupabaseClient()
    console.log("Getting user profile for:", userId)
    const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
    
    if (error) {
      console.error("Error fetching profile:", error.message, error.details)
      throw error
    }
    
    return data
  } catch (error) {
    console.error("Exception in getUserProfileClient:", error)
    // Em desenvolvimento, retornar um perfil mock para não quebrar a UI
    if (process.env.NODE_ENV === 'development') {
      console.log("DEV MODE: Returning mock profile after error for", userId)
      return {
        id: userId,
        email: "dev@example.com",
        name: "Dev User",
        onboarding: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      }
    }
    throw error
  }
}
