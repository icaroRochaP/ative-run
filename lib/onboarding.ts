import { getSupabaseClient, isSupabaseConfigured, isSupabaseAdminConfigured } from "./supabase"
import { createAdminClient } from "./supabase-admin"

export type OnboardingQuestion = {
  id: string
  step_number: number
  question_type: "text" | "number" | "email" | "radio" | "checkbox" | "textarea"
  title: string
  subtitle: string | null
  emoji: string | null
  icon: string | null
  field_name: string
  placeholder: string | null
  required: boolean
  options: string[] | null
  validation: Record<string, any> | null
  conditional_logic: Record<string, any> | null
  is_active: boolean
  created_at: string
  updated_at: string
}

export type OnboardingResponse = {
  id: string
  user_id: string
  question_id: string
  response_value: string | null
  response_array: string[] | null
  completed_at: string
}

// Fallback questions for when Supabase is not configured
const fallbackQuestions: OnboardingQuestion[] = [
  {
    id: "1",
    step_number: 0,
    question_type: "text",
    title: "Nice to meet you!",
    subtitle: "How would you like to be addressed?",
    emoji: null,
    icon: "User",
    field_name: "name",
    placeholder: "Enter your name...",
    required: true,
    options: null,
    validation: { minLength: 2 },
    conditional_logic: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    step_number: 1,
    question_type: "number",
    title: "What's your age?",
    subtitle: "This helps us personalize your fitness plan",
    emoji: "🎂",
    icon: null,
    field_name: "age",
    placeholder: "25",
    required: true,
    options: null,
    validation: { min: 13, max: 100 },
    conditional_logic: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    step_number: 2,
    question_type: "email",
    title: "Your email address",
    subtitle: "For account recovery and important updates",
    emoji: "📧",
    icon: null,
    field_name: "email",
    placeholder: "your@email.com",
    required: true,
    options: null,
    validation: { pattern: "email" },
    conditional_logic: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "4",
    step_number: 3,
    question_type: "radio",
    title: "Which gender do you identify with?",
    subtitle: "This helps us provide better recommendations",
    emoji: "👤",
    icon: null,
    field_name: "gender",
    placeholder: null,
    required: true,
    options: ["Female", "Male", "Other / Prefer not to say"],
    validation: null,
    conditional_logic: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "5",
    step_number: 4,
    question_type: "text",
    title: "What's your current weight?",
    subtitle: 'Please specify in kg or lbs (e.g., "65 kg" or "145 lbs")',
    emoji: "⚖️",
    icon: null,
    field_name: "weight",
    placeholder: "65 kg or 145 lbs",
    required: true,
    options: null,
    validation: null,
    conditional_logic: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "6",
    step_number: 5,
    question_type: "text",
    title: "What's your current height?",
    subtitle: 'Please specify in cm or feet/inches (e.g., "170 cm" or "5\'7")',
    emoji: "📏",
    icon: null,
    field_name: "height",
    placeholder: "170 cm or 5'7\"",
    required: true,
    options: null,
    validation: null,
    conditional_logic: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "7",
    step_number: 6,
    question_type: "radio",
    title: "What's your primary goal?",
    subtitle: "Be specific about what you want to achieve",
    emoji: null,
    icon: "Target",
    field_name: "primaryGoal",
    placeholder: null,
    required: true,
    options: ["Fat Loss", "Muscle Gain", "Toning", "Health and Energy", "Other (specify)"],
    validation: null,
    conditional_logic: null,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
]

export const getOnboardingQuestions = async (): Promise<OnboardingQuestion[]> => {
  if (!isSupabaseConfigured()) {
    console.warn("Supabase not configured, using fallback questions")
    return fallbackQuestions
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("onboarding_questions")
      .select("*")
      .eq("is_active", true)
      .order("step_number", { ascending: true })

    if (error) throw error
    return data as OnboardingQuestion[]
  } catch (error) {
    console.error("Error fetching questions from Supabase, using fallback:", error)
    return fallbackQuestions
  }
}

export const getUserResponses = async (userId: string) => {
  console.log("[ONBOARDING] getUserResponses chamado com userId:", userId)
  if (!isSupabaseAdminConfigured()) {
    console.error("[ONBOARDING] Supabase admin NÃO configurado!")
    return []
  }
  try {
    const supabase = createAdminClient()
    console.log("[ONBOARDING] getUserResponses - admin client criado")
    const { data, error } = await supabase
      .from("onboarding_responses")
      .select(`
        *,
        onboarding_questions (*)
      `)
      .eq("user_id", userId)
    console.log("[ONBOARDING] getUserResponses - data:", data)
    console.log("[ONBOARDING] getUserResponses - error:", error)
    if (error) throw error
    return data
  } catch (error) {
    console.error("[ONBOARDING] getUserResponses - erro catch:", error)
    return []
  }
}

export const getUserResponsesClient = async (userId: string) => {
  try {
    const res = await fetch("/api/get-user-responses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    })
    const result = await res.json()
    if (result.error) {
      console.error("[ONBOARDING] Erro na API get-user-responses:", result.error)
      return []
    }
    return result.data || []
  } catch (err) {
    console.error("[ONBOARDING] Erro fetch getUserResponsesClient:", err)
    return []
  }
}

// Removed saveResponse from here, it's now part of saveIndividualOnboardingResponseAndProfile server action

// Removed saveAllResponses from here, it's now a Server Action in app/auth-actions.ts

// Removed saveResponseAndUpdateProfile from here, it's now a Server Action in app/auth-actions.ts

export const getResponseByQuestion = async (userId: string, questionId: string) => {
  if (!isSupabaseConfigured()) {
    return null
  }

  try {
    const supabase = getSupabaseClient()
    const { data, error } = await supabase
      .from("onboarding_responses")
      .select("*")
      .eq("user_id", userId)
      .eq("question_id", questionId)
      .single()

    if (error && error.code !== "PGRST116") throw error
    return data
  } catch (error) {
    console.error("Error fetching response:", error)
    return null
  }
}

export const deleteResponse = async (userId: string, questionId: string) => {
  if (!isSupabaseConfigured()) {
    return
  }

  try {
    const supabase = getSupabaseClient()
    const { error } = await supabase
      .from("onboarding_responses")
      .delete()
      .eq("user_id", userId)
      .eq("question_id", questionId)

    if (error) throw error
  } catch (error) {
    console.error("Error deleting response:", error)
  }
}

export const getOnboardingProgress = async (userId: string) => {
  const questions = await getOnboardingQuestions()
  const responses = await getUserResponses(userId)

  const totalQuestions = questions.length
  const completedQuestions = responses.length
  const progress = (completedQuestions / totalQuestions) * 100

  return {
    totalQuestions,
    completedQuestions,
    progress,
    isComplete: completedQuestions === totalQuestions,
  }
}

export const shouldShowQuestion = (question: OnboardingQuestion, allResponses: Record<string, any>): boolean => {
  if (!question.conditional_logic) return true

  const { showIf } = question.conditional_logic

  if (!showIf) return true

  // Check each condition
  for (const [fieldName, expectedValue] of Object.entries(showIf)) {
    const userResponse = allResponses[fieldName]

    if (Array.isArray(expectedValue)) {
      if (!expectedValue.includes(userResponse)) return false
    } else {
      if (userResponse !== expectedValue) return false
    }
  }

  return true
}

export const validateResponse = (
  question: OnboardingQuestion,
  value: string | string[] | null,
): { isValid: boolean; error?: string } => {
  // Check if required
  if (question.required) {
    if (!value || (Array.isArray(value) && value.length === 0)) {
      return { isValid: false, error: "This field is required" }
    }
  }

  if (!question.validation || !value) {
    return { isValid: true }
  }

  const validation = question.validation

  // String validations
  if (typeof value === "string") {
    if (validation.minLength && value.length < validation.minLength) {
      return { isValid: false, error: `Minimum ${validation.minLength} characters required` }
    }

    if (validation.maxLength && value.length > validation.maxLength) {
      return { isValid: false, error: `Maximum ${validation.maxLength} characters allowed` }
    }

    if (validation.pattern === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      if (!emailRegex.test(value)) {
        return { isValid: false, error: "Please enter a valid email address" }
      }
    }
  }

  // Number validations
  if (question.question_type === "number" && typeof value === "string") {
    const numValue = Number(value)

    if (isNaN(numValue)) {
      return { isValid: false, error: "Please enter a valid number" }
    }

    if (validation.min && numValue < validation.min) {
      return { isValid: false, error: `Minimum value is ${validation.min}` }
    }

    if (validation.max && numValue > validation.max) {
      return { isValid: false, error: `Maximum value is ${validation.max}` }
    }
  }

  return { isValid: true }
}

export const getLeadByIdClient = async (leadId: string) => {
  try {
    const res = await fetch("/api/get-lead-by-id", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ leadId }),
    })
    const result = await res.json()
    if (result.error) {
      console.error("[ONBOARDING] Erro na API get-lead-by-id:", result.error)
      return null
    }
    return result.data || null
  } catch (err) {
    console.error("[ONBOARDING] Erro fetch getLeadByIdClient:", err)
    return null
  }
}
