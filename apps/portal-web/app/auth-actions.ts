"use server"

import { createServerClient } from "@/lib/supabase-server"
import { createAdminClient } from "@/lib/supabase-admin"
import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"
import type { Database } from "@/lib/database.types"
import type { OnboardingQuestion } from "@/lib/onboarding"

type UserInsert = Database["public"]["Tables"]["users"]["Insert"]
type User = Database["public"]["Tables"]["users"]["Row"]

export async function signUpAndCreateProfile(email: string, onboardingData: Record<string, any>, password?: string) {
  // Environment variables check
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.error("❌ Server Action: Missing Supabase environment variables")
    return { error: "Supabase environment variables are not configured on the server." }
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("❌ Server Action: Missing SUPABASE_SERVICE_ROLE_KEY")
    return { error: "Database error saving new user" }
  }

  console.log("👤 Server Action: Attempting to create auth user with email:", email)
  console.log("📋 Server Action: Onboarding data for auth user creation:", onboardingData)

  // Try using admin client directly for auth creation
  try {
    const supabaseAdmin = createAdminClient()
    
    console.log("👤 Server Action: Using admin client to create auth user...")
    const { data, error: signUpError } = await supabaseAdmin.auth.admin.createUser({
      email: email,
      password: password || Math.random().toString(36).slice(-12) + "Aa1!",
      user_metadata: {
        name: onboardingData.name,
        age: onboardingData.age,
        gender: onboardingData.gender,
      },
      email_confirm: true, // Auto-confirm email to avoid confirmation issues
    })

    if (signUpError) {
      console.error("❌ Server Action: Error creating auth user with admin:", signUpError)
      console.error("❌ Server Action: Error details:", JSON.stringify(signUpError, null, 2))
      return { error: `Auth error: ${signUpError.message}` }
    }

    if (!data.user) {
      return { error: "Server Action: User data not returned after sign up." }
    }

    console.log("✅ Server Action: Auth user created successfully with admin client:", data.user.id)

    const profileData: UserInsert = {
      id: data.user.id,
      name: onboardingData.name || "",
      phone: onboardingData.phone || "",
      nickname: onboardingData.nickname || "",
      email: email,
      onboarding: false, // Initialize onboarding as false for new users
    }

    console.log("👤 Server Action: Attempting to insert user profile using admin client for ID:", profileData.id)
    console.log("👤 Server Action: Profile data:", profileData)

    const { data: insertData, error: profileError } = await supabaseAdmin.from("users").upsert(profileData, { onConflict: "id" })

    if (profileError) {
      console.error("❌ Server Action: Error creating user profile with admin client:", profileError)
      console.error("❌ Server Action: Error details:", JSON.stringify(profileError, null, 2))
      return { error: `Database error saving new user: ${profileError.message}` }
    }
    console.log("✅ Server Action: User profile created successfully with admin client for ID:", data.user.id)
    console.log("✅ Server Action: Insert data:", insertData)

    return { data, error: null }
  } catch (error: any) {
    console.error("❌ Server Action: Error in signUpAndCreateProfile:", error)
    console.error("❌ Server Action: Error details:", JSON.stringify(error, null, 2))
    return { error: `Database error saving new user: ${error.message}` }
  }
}

export async function saveOnboardingResponses(
  userId: string,
  responses: Record<string, any>,
  questions: OnboardingQuestion[],
) {
  try {
    const supabaseAdmin = createAdminClient()
    const responsesToSave = []

    console.log("🔎 saveOnboardingResponses: userId:", userId)
    console.log("🔎 saveOnboardingResponses: responses:", responses)
    console.log("🔎 saveOnboardingResponses: questions:", questions)

    for (const question of questions) {
      const value = responses[question.field_name]
      if (value !== undefined && value !== null && (Array.isArray(value) || String(value).trim() !== "")) {
        responsesToSave.push({
          user_id: userId,
          question_id: question.id,
          response_value: Array.isArray(value) ? null : value,
          response_array: Array.isArray(value) ? value : null,
          completed_at: new Date().toISOString(),
        })
      }
    }
    console.log("🔎 saveOnboardingResponses: responsesToSave:", responsesToSave)

    console.log("💾 Server Action: Saving all responses using admin client:", responsesToSave)

    if (responsesToSave.length > 0) {
      const { data, error } = await supabaseAdmin.from("onboarding_responses").insert(responsesToSave).select()

      if (error) {
        console.error("❌ Server Action: Error saving all responses with admin client:", error)
        throw error
      }

      console.log("✅ Server Action: All responses saved successfully with admin client:", data)
      return data
    }

    return []
  } catch (error) {
    console.error("❌ Server Action: Error in saveOnboardingResponses:", error)
    throw error
  }
}

// NEW SERVER ACTION: Save individual onboarding response and update user profile
export async function saveIndividualOnboardingResponseAndProfile(
  userId: string,
  questionId: string,
  fieldName: string,
  value: string | string[] | null,
) {
  try {
    const supabaseAdmin = createAdminClient()

    // 1. Save response in onboarding_responses table
    const responseValue = Array.isArray(value) ? null : value
    const responseArray = Array.isArray(value) ? value : null

    console.log("💾 Server Action: Saving individual response using admin client:", {
      userId,
      questionId,
      responseValue,
      responseArray,
    })

    const { error: responseError } = await supabaseAdmin.from("onboarding_responses").upsert(
      {
        user_id: userId,
        question_id: questionId,
        response_value: responseValue,
        response_array: responseArray,
        completed_at: new Date().toISOString(),
      },
      { onConflict: "user_id,question_id" },
    ) // Use upsert with onConflict

    if (responseError) {
      console.error("❌ Server Action: Error saving individual response with admin client:", responseError)
      throw responseError
    }
    console.log("✅ Server Action: Individual response saved successfully with admin client.")

    // 2. Update user profile if it's a relevant field
    const profileFields = ["name", "gender", "weight", "height", "email", "primaryGoal"]

    if (profileFields.includes(fieldName)) {
      const updateData: any = {}

      if (fieldName === "primaryGoal") {
        updateData.primary_goal = value
      } else if (fieldName === "email") {
        updateData.email = value
      } else {
        updateData[fieldName] = value
      }

      if (Object.keys(updateData).length > 0) {
        updateData.updated_at = new Date().toISOString()

        console.log("👤 Server Action: Updating user profile using admin client:", updateData)

        const { error: profileError } = await supabaseAdmin.from("users").update(updateData).eq("id", userId)

        if (profileError) {
          console.error("❌ Server Action: Error updating profile with admin client:", profileError)
          throw profileError
        } else {
          console.log("✅ Server Action: Profile updated successfully with admin client")
        }
      }
    }

    return true
  } catch (error) {
    console.error("❌ Server Action: Error in saveIndividualOnboardingResponseAndProfile:", error)
    throw error
  }
}

export async function completeOnboarding(userId: string, userData: Partial<User>) {
  console.log("🎯 Server Action: Starting completeOnboarding for userId:", userId)
  console.log("📋 Server Action: userData to update:", userData)
  
  const supabase = await createServerClient()
  const { error } = await supabase
    .from("users")
    .update({
      ...userData,
      onboarding: true, // Mark onboarding as completed
    })
    .eq("id", userId)

  if (error) {
    console.error("❌ Server Action: Error in completeOnboarding:", error)
    throw error
  }
  
  console.log("✅ Server Action: completeOnboarding completed successfully for userId:", userId)
}

export async function signIn(prevState: any, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  const supabase = await createServerClient()
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    console.error("❌ Server Action: Sign In Error:", error.message)
    return { error: error.message }
  }
  console.log("✅ Server Action: User signed in:", data.user?.id)
  return { data, error: null }
}

export async function signOut() {
  const supabase = await createServerClient()
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}

export async function getCurrentUser() {
  const supabase = await createServerClient()
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()
  if (error) {
    console.error("Error getting current user on server:", error)
    return null
  }
  return user
}

export async function getUserProfile(userId: string) {
  const supabase = await createServerClient()
  const { data, error } = await supabase.from("users").select("*").eq("id", userId).single()
  if (error) throw error
  return data
}

export async function updateUserProfile(userId: string, updates: Partial<User>) {
  const supabase = await createServerClient()
  const { data, error } = await supabase
    .from("users")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", userId)
    .select()
    .single()
  if (error) throw error
  return data
}

// NEW SERVER ACTION: Send password reset email
export async function sendPasswordResetEmail(prevState: any, formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required." }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_VERCEL_URL || "http://localhost:3000"}/auth/update-password`, // Use VERCEL_URL for production
  })

  if (error) {
    console.error("❌ Server Action: Password Reset Error:", error.message)
    return { error: error.message }
  }

  console.log("✅ Server Action: Password reset email sent to:", email)
  return { success: "Password reset link sent to your email!", error: null }
}

// NEW SERVER ACTION: Resend confirmation email
export async function resendConfirmationEmail(prevState: any, formData: FormData) {
  const email = formData.get("email") as string

  if (!email) {
    return { error: "Email is required." }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.resend({
    type: "signup",
    email: email,
  })

  if (error) {
    console.error("❌ Server Action: Resend Confirmation Error:", error.message)
    return { error: error.message }
  }

  console.log("✅ Server Action: Confirmation email resent to:", email)
  return { success: "Confirmation email resent! Please check your inbox.", error: null }
}

// NEW SERVER ACTION: Update user password
export async function updatePassword(prevState: any, formData: FormData) {
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (password !== confirmPassword) {
    return { error: "Passwords do not match." }
  }

  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." }
  }

  const supabase = await createServerClient()
  const { error } = await supabase.auth.updateUser({ password: password })

  if (error) {
    console.error("❌ Server Action: Update Password Error:", error.message)
    return { error: error.message }
  }

  console.log("✅ Server Action: User password updated successfully.")
  return { success: "Your password has been updated successfully!", error: null }
}

export async function testAuthSession() {
  console.log("🧪 Test Auth Session: Starting")
  
  try {
    const supabase = await createServerClient()
    
    // Debug: Check cookies
    const cookieStore = await cookies()
    console.log("🍪 Test Auth: Available cookies:", cookieStore.getAll().map((c: any) => c.name))
    
    // Get current user to verify they are authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    
    console.log("👤 Test Auth: User data:", user ? { id: user.id, email: user.email } : "null")
    console.log("❌ Test Auth: User error:", userError)
    
    if (userError || !user) {
      return { success: false, error: "Usuário não autenticado", details: userError }
    }
    
    return { success: true, user: { id: user.id, email: user.email } }
    
  } catch (error) {
    console.error("❌ Test Auth: Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return { success: false, error: errorMessage }
  }
}

export async function changePasswordSimple(
  userId: string,
  currentPassword: string, 
  newPassword: string
) {
  console.log("🔑 Simple Password Change: Starting for userId:", userId)
  
  try {
    // Create admin client for password update
    const supabaseAdmin = createAdminClient()
    
    // Create client for password verification
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      throw new Error("Configuração do Supabase não encontrada")
    }

    const tempSupabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
    
    // Get user profile to get email
    const { data: profile, error: profileError } = await supabaseAdmin
      .from("users")
      .select("email")
      .eq("id", userId)
      .single()

    if (profileError) {
      console.error("❌ Simple Password Change: Error fetching user profile:", profileError)
      throw new Error("Erro ao buscar perfil do usuário")
    }

    console.log("📋 Simple Password Change: User profile found:", { email: profile.email })

    // Verify current password by attempting to sign in
    const { data: verifyData, error: verifyError } = await tempSupabase.auth.signInWithPassword({
      email: profile.email,
      password: currentPassword,
    })

    // Immediately sign out the temporary session
    if (verifyData.session) {
      await tempSupabase.auth.signOut()
    }

    if (verifyError) {
      console.error("❌ Simple Password Change: Current password verification failed:", verifyError.message)
      
      if (verifyError.message.includes("Invalid login credentials")) {
        throw new Error("Senha atual incorreta")
      } else {
        throw new Error("Erro na verificação da senha atual")
      }
    }

    console.log("✅ Simple Password Change: Current password verified successfully")

    // Update password using admin client
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(userId, {
      password: newPassword
    })

    if (updateError) {
      console.error("❌ Simple Password Change: Password update failed:", updateError)
      throw new Error("Erro ao atualizar senha: " + updateError.message)
    }

    console.log("✅ Simple Password Change: Password updated successfully")

    // Mark account as no longer new using admin client
    const { error: profileUpdateError } = await supabaseAdmin
      .from("users")
      .update({ 
        new_account: false
      })
      .eq("id", userId)

    if (profileUpdateError) {
      console.error("❌ Simple Password Change: Profile update failed:", profileUpdateError)
      console.warn("⚠️ Password changed but failed to update new_account flag")
    } else {
      console.log("✅ Simple Password Change: Profile updated - new_account set to false")
    }

    console.log("✅ Simple Password Change: Process completed for userId:", userId)
    return { success: true, error: null }
    
  } catch (error) {
    console.error("❌ Simple Password Change: Error:", error)
    const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
    return { success: false, error: errorMessage }
  }
}
