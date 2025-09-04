import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

// Create a properly typed Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://qzzeewrkdruavnnecypl.supabase.co"
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF6emVld3JrZHJ1YXZubmVjeXBsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI0NDQ0NDQsImV4cCI6MjA2ODAyMDQ0NH0.-SBE14H0vUeNtUmDiaStAN30dmFcQCHuO-QMAV0nyb0"

const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Local type definitions to work around compilation issues
type TrainingPlan = {
  id: string
  user_id: string
  name: string
  objective: string
  start_date: string
  end_date: string | null
  is_active: boolean | null
  created_at: string
}

type WorkoutTemplate = {
  id: string
  name: string
  description: string | null
  objective: string | null
  estimated_duration_minutes: number | null
  created_by_agent_id: string | null
  created_at: string
}

type PlanWorkout = {
  id: string
  training_plan_id: string
  workout_template_id: string
  day_of_week: string
}

type WorkoutTemplateExercise = {
  id: string
  workout_template_id: string
  exercise_id: string
  order_in_workout: number
  target_sets: number | null
  target_reps: string | null
  target_rest_seconds: number | null
  notes: string | null
}

type Exercise = {
  id: string
  name: string
  description: string | null
  video_url: string | null
  target_muscle_groups: string[]
  equipment_needed: string[]
  difficulty_level: string
  created_at: string
}

type WorkoutLog = {
  id: string
  user_id: string
  workout_template_id: string | null
  started_at: string
  completed_at: string | null
  finish: boolean | null
  notes: string | null
}

type SetLog = {
  id: string
  workout_log_id: string
  exercise_id: string
  set_number: number
  completed_reps: number | null
  weight_kg: number | null
  completed_at: string
}

// Enhanced types for frontend consumption
export interface TrainingPlanWithWorkouts extends TrainingPlan {
  plan_workouts: Array<PlanWorkout & {
    workout_template: WorkoutTemplate & {
      total_exercises: number
      total_sets: number
    }
  }>
}

export interface WorkoutTemplateWithExercises extends WorkoutTemplate {
  workout_template_exercises: Array<WorkoutTemplateExercise & {
    exercise: Exercise
  }>
}

export interface WorkoutLogWithDetails extends WorkoutLog {
  workout_template: WorkoutTemplate | null
  completed_sets: number
  duration_minutes: number | null
}

export interface WeeklyWorkoutSchedule {
  training_plan: TrainingPlan
  workouts: Array<{
    day_of_week: string
    workout_template: WorkoutTemplate
    total_exercises: number
    total_sets: number
    completed_today: boolean
  }>
}

// Mock data for development/testing
const mockTrainingPlan: TrainingPlan = {
  id: "1",
  user_id: "mock-user",
  name: "Plano de Treino Funcional",
  objective: "Fortalecimento geral e condicionamento",
  start_date: "2024-01-01",
  end_date: "2024-12-31",
  is_active: true,
  created_at: "2024-01-01T00:00:00Z"
}

const mockWorkoutTemplates: WorkoutTemplate[] = [
  {
    id: "1",
    name: "Treino A - Peito e Tríceps",
    description: "Foco no fortalecimento do peitoral e tríceps",
    objective: "Hipertrofia",
    estimated_duration_minutes: 60,
    created_by_agent_id: "ai-agent",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2", 
    name: "Treino B - Costas e Bíceps",
    description: "Fortalecimento das costas e bíceps",
    objective: "Hipertrofia",
    estimated_duration_minutes: 65,
    created_by_agent_id: "ai-agent",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "3",
    name: "Treino C - Pernas e Core",
    description: "Treino completo para membros inferiores",
    objective: "Força e estabilidade",
    estimated_duration_minutes: 70,
    created_by_agent_id: "ai-agent",
    created_at: "2024-01-01T00:00:00Z"
  }
]

const mockExercises: Exercise[] = [
  {
    id: "1",
    name: "Supino Reto",
    description: "Exercício fundamental para o peitoral",
    video_url: "https://example.com/supino",
    target_muscle_groups: ["Peitoral", "Tríceps"],
    equipment_needed: ["Barra", "Banco"],
    difficulty_level: "Intermediário",
    created_at: "2024-01-01T00:00:00Z"
  },
  {
    id: "2",
    name: "Flexão de Braço",
    description: "Exercício com peso corporal",
    video_url: "https://example.com/flexao",
    target_muscle_groups: ["Peitoral", "Tríceps", "Core"],
    equipment_needed: [],
    difficulty_level: "Iniciante",
    created_at: "2024-01-01T00:00:00Z"
  }
]

/**
 * Check if training tables exist by attempting a simple query
 */
const checkTrainingTablesExist = async (): Promise<boolean> => {
  if (!supabase) return false
  
  try {
    const { error } = await supabase
      .from("training_plans")
      .select("id")
      .limit(1)
    
    return !error
  } catch {
    return false
  }
}

/**
 * Get the active training plan for a user with all associated workouts
 */
export const getActiveTrainingPlan = async (userId: string): Promise<TrainingPlanWithWorkouts | null> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  
  if (!tablesExist) {
    // Return mock data if tables don't exist
    console.log("Training tables not found, using mock data")
    return {
      ...mockTrainingPlan,
      user_id: userId,
      plan_workouts: [
        {
          id: "1",
          training_plan_id: "1",
          workout_template_id: "1",
          day_of_week: "segunda-feira",
          workout_template: {
            ...mockWorkoutTemplates[0],
            total_exercises: 4,
            total_sets: 12
          }
        },
        {
          id: "2", 
          training_plan_id: "1",
          workout_template_id: "2",
          day_of_week: "quarta-feira",
          workout_template: {
            ...mockWorkoutTemplates[1],
            total_exercises: 5,
            total_sets: 15
          }
        },
        {
          id: "3",
          training_plan_id: "1", 
          workout_template_id: "3",
          day_of_week: "sexta-feira",
          workout_template: {
            ...mockWorkoutTemplates[2],
            total_exercises: 6,
            total_sets: 18
          }
        }
      ]
    }
  }

  try {
    const { data, error } = await supabase
      .from("training_plans")
      .select("*")
      .eq("user_id", userId)
      .eq("is_active", true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return null
      }
      throw error
    }

    if (!data) return null

    // Get plan workouts separately with proper error handling
    const { data: planWorkouts } = await supabase
      .from("plan_workouts")
      .select(`
        *,
        workout_templates (*)
      `)
      .eq("training_plan_id", (data as any).id)

    const enrichedPlanWorkouts = (planWorkouts || []).map((pw: any) => ({
      ...pw,
      workout_template: {
        ...pw.workout_templates,
        total_exercises: 0,
        total_sets: 0
      }
    }))

    return {
      ...(data as any),
      plan_workouts: enrichedPlanWorkouts
    } as TrainingPlanWithWorkouts
  } catch (error) {
    console.error('Error fetching training plan:', error)
    throw error
  }
}

/**
 * Get weekly workout schedule with detailed information - OPTIMIZED VERSION
 */
export const getWeeklyWorkoutSchedule = async (trainingPlanId: string): Promise<WeeklyWorkoutSchedule | null> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  
  if (!tablesExist) {
    // Return mock data
    return {
      training_plan: mockTrainingPlan,
      workouts: [
        {
          day_of_week: "segunda-feira",
          workout_template: mockWorkoutTemplates[0],
          total_exercises: 4,
          total_sets: 12,
          completed_today: false
        },
        {
          day_of_week: "quarta-feira", 
          workout_template: mockWorkoutTemplates[1],
          total_exercises: 5,
          total_sets: 15,
          completed_today: false
        },
        {
          day_of_week: "sexta-feira",
          workout_template: mockWorkoutTemplates[2], 
          total_exercises: 6,
          total_sets: 18,
          completed_today: false
        }
      ]
    }
  }

  try {
    // Fetch all data in parallel for better performance
    const [planResult, planWorkoutsResult] = await Promise.all([
      supabase
        .from("training_plans")
        .select("*")
        .eq("id", trainingPlanId)
        .single(),
      
      supabase
        .from("plan_workouts")
        .select(`
          day_of_week,
          workout_templates (*)
        `)
        .eq("training_plan_id", trainingPlanId)
    ])

    if (planResult.error) throw planResult.error
    const planData = planResult.data
    const planWorkouts = planWorkoutsResult.data || []

    if (planWorkouts.length === 0) {
      return {
        training_plan: planData as TrainingPlan,
        workouts: []
      }
    }

    // Get all workout template IDs for batch queries
    const workoutTemplateIds = planWorkouts
      .map((pw: any) => pw.workout_templates?.id)
      .filter(Boolean)

    // Batch fetch all exercises for all workout templates
    const [exercisesResult, completionResult] = await Promise.all([
      workoutTemplateIds.length > 0 
        ? supabase
            .from("workout_template_exercises")
            .select("workout_template_id, target_sets")
            .in("workout_template_id", workoutTemplateIds)
        : { data: [], error: null },
      
      // Batch check completion status for current week
      checkMultipleWorkoutsCompletedThisWeek(
        (planData as any).user_id,
        planWorkouts.map((pw: any) => ({
          workoutTemplateId: pw.workout_templates?.id || "",
          dayOfWeek: pw.day_of_week || ""
        }))
      )
    ])

    // Group exercises by workout template ID for faster lookup
    const exercisesByTemplate: Record<string, any[]> = {}
    if (exercisesResult.data) {
      exercisesResult.data.forEach((exercise: any) => {
        if (!exercisesByTemplate[exercise.workout_template_id]) {
          exercisesByTemplate[exercise.workout_template_id] = []
        }
        exercisesByTemplate[exercise.workout_template_id].push(exercise)
      })
    }

    // Build final workout array
    const workouts = planWorkouts.map((pw: any, index: number) => {
      const templateId = pw.workout_templates?.id || ""
      const exercises = exercisesByTemplate[templateId] || []
      
      return {
        day_of_week: pw.day_of_week || "",
        workout_template: pw.workout_templates || {},
        total_exercises: exercises.length,
        total_sets: exercises.reduce((sum: number, ex: any) => sum + (ex.target_sets || 0), 0),
        completed_today: completionResult[index] || false
      }
    })

    return {
      training_plan: planData as TrainingPlan,
      workouts
    }
  } catch (error) {
    console.error('Error fetching weekly schedule:', error)
    throw error
  }
}

/**
 * Get detailed workout template with all exercises
 */
export const getWorkoutTemplate = async (workoutTemplateId: string): Promise<WorkoutTemplateWithExercises | null> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  
  if (!tablesExist) {
    // Return mock template
    const template = mockWorkoutTemplates.find(t => t.id === workoutTemplateId)
    if (!template) return null
    
    return {
      ...(template as any),
      workout_template_exercises: [
        {
          id: "1",
          workout_template_id: workoutTemplateId,
          exercise_id: "1",
          order_in_workout: 1,
          target_sets: 3,
          target_reps: "8-12",
          target_rest_seconds: 60,
          notes: "Manter a forma correta",
          exercise: mockExercises[0]
        },
        {
          id: "2",
          workout_template_id: workoutTemplateId,
          exercise_id: "2", 
          order_in_workout: 2,
          target_sets: 3,
          target_reps: "10-15",
          target_rest_seconds: 45,
          notes: "Descida controlada",
          exercise: mockExercises[1]
        }
      ]
    }
  }

  try {
    const { data: template, error: templateError } = await supabase
      .from("workout_templates")
      .select("*")
      .eq("id", workoutTemplateId)
      .single()

    if (templateError) {
      if (templateError.code === 'PGRST116') {
        return null
      }
      throw templateError
    }

    const { data: templateExercises } = await supabase
      .from("workout_template_exercises")
      .select(`
        *,
        exercises (*)
      `)
      .eq("workout_template_id", workoutTemplateId)
      .order("order_in_workout")

    const enrichedExercises = (templateExercises || []).map((te: any) => ({
      ...te,
      exercise: te.exercises
    }))

    return {
      ...(template as any),
      workout_template_exercises: enrichedExercises
    } as WorkoutTemplateWithExercises
  } catch (error) {
    console.error('Error fetching workout template:', error)
    throw error
  }
}

/**
 * Get workout history for a user with pagination
 */
export const getWorkoutHistory = async (
  userId: string, 
  limit: number = 10, 
  offset: number = 0
): Promise<WorkoutLogWithDetails[]> => {
  console.log(`🔍 getWorkoutHistory called: userId=${userId.slice(0, 8)}..., limit=${limit}, offset=${offset}`)
  
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  console.log(`🔍 Training tables exist: ${tablesExist}`)
  
  if (!tablesExist) {
    // Return mock data with proper pagination
    const mockHistory: WorkoutLogWithDetails[] = [
      {
        id: "mock-1",
        user_id: userId,
        workout_template_id: "1",
        started_at: new Date().toISOString(),
        completed_at: new Date().toISOString(),
        finish: true,
        notes: null,
        workout_template: mockWorkoutTemplates[0],
        completed_sets: 24,
        duration_minutes: 60
      },
      {
        id: "mock-2", 
        user_id: userId,
        workout_template_id: "3",
        started_at: new Date(Date.now() - 60000).toISOString(),
        completed_at: new Date(Date.now() - 60000).toISOString(),
        finish: true,
        notes: null,
        workout_template: mockWorkoutTemplates[2],
        completed_sets: 18,
        duration_minutes: 55
      },
      {
        id: "mock-3",
        user_id: userId,
        workout_template_id: "2", 
        started_at: new Date(Date.now() - 120000).toISOString(),
        completed_at: new Date(Date.now() - 120000).toISOString(),
        finish: true,
        notes: null,
        workout_template: mockWorkoutTemplates[1],
        completed_sets: 15,
        duration_minutes: 50
      }
    ]

    // Apply pagination to mock data
    const startIndex = offset
    const endIndex = Math.min(offset + limit, mockHistory.length)
    const paginatedData = mockHistory.slice(startIndex, endIndex)
    
    // Check if there are more items after the current page
    const hasMoreItems = offset + limit < mockHistory.length
    
    console.log(`🔍 Mock pagination: offset=${offset}, limit=${limit}, total=${mockHistory.length}, returning=${paginatedData.length} items, hasMore=${hasMoreItems}`)
    
    // If we found there are no more items and we're on page 0, 
    // that means pagination should not be shown
    if (!hasMoreItems && offset === 0) {
      console.log(`🔍 No pagination needed - only ${mockHistory.length} items total`)
    }
    
    return paginatedData
  }

  try {
    console.log('🔄 Fetching workout history from database...')
    const { data: logs } = await supabase
      .from("workout_logs")
      .select(`
        *,
        workout_templates (*)
      `)
      .eq("user_id", userId)
      .eq("finish", true)  // Only show finished workouts
      .order("started_at", { ascending: false })
      .range(offset, offset + limit - 1)

    if (!logs || logs.length === 0) {
      console.log('🔍 No workout logs found')
      return []
    }

    // Batch fetch all set counts for all workout logs
    const workoutLogIds = logs.map((log: any) => log.id)
    const { data: allSets } = await supabase
      .from("set_logs")
      .select("workout_log_id")
      .in("workout_log_id", workoutLogIds)

    // Group sets by workout_log_id for faster lookup
    const setCountByLog: Record<string, number> = {}
    if (allSets) {
      allSets.forEach((set: any) => {
        setCountByLog[set.workout_log_id] = (setCountByLog[set.workout_log_id] || 0) + 1
      })
    }

    // Process all logs without additional async calls
    const enrichedLogs = logs.map((log: any) => {
      const setCount = setCountByLog[log.id] || 0

      let durationMinutes = null
      if (log.started_at && log.completed_at) {
        try {
          const start = new Date(log.started_at as string)
          const end = new Date(log.completed_at as string)
          durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
        } catch (e) {
          console.error('Error calculating duration:', e)
        }
      }

      return {
        ...(log as any),
        workout_template: (log as any).workout_templates,
        completed_sets: setCount,
        duration_minutes: durationMinutes
      } as WorkoutLogWithDetails
    })

    console.log(`✅ Workout history loaded: ${enrichedLogs.length} items`)
    return enrichedLogs
  } catch (error) {
    console.error('Error fetching workout history:', error)
    return []
  }
}

/**
 * Get detailed workout log with all sets performed
 */
export const getWorkoutDetails = async (workoutLogId: string): Promise<WorkoutLogWithDetails | null> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  
  if (!tablesExist) {
    return null
  }

  try {
    const { data: log, error: logError } = await supabase
      .from("workout_logs")
      .select(`
        *,
        workout_templates (*)
      `)
      .eq("id", workoutLogId)
      .single()

    if (logError) {
      if (logError.code === 'PGRST116') {
        return null
      }
      throw logError
    }

    const { data: sets } = await supabase
      .from("set_logs")
      .select("*")
      .eq("workout_log_id", workoutLogId)

    let durationMinutes = null
    if (log && (log as any).started_at && (log as any).completed_at) {
      try {
        const start = new Date((log as any).started_at as string)
        const end = new Date((log as any).completed_at as string)
        durationMinutes = Math.round((end.getTime() - start.getTime()) / (1000 * 60))
      } catch {
        // Invalid date format
      }
    }

    return {
      ...(log as any),
      workout_template: (log as any)?.workout_templates,
      completed_sets: sets?.length || 0,
      duration_minutes: durationMinutes
    } as unknown as WorkoutLogWithDetails
  } catch (error) {
    console.error('Error fetching workout details:', error)
    throw error
  }
}

/**
 * Get training stats for a user (for dashboard summary)
 */
export const getTrainingStats = async (userId: string) => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  
  if (!tablesExist) {
    // Return mock stats
    return {
      workoutsThisMonth: 8,
      streakDays: 3
    }
  }

  try {
    const currentMonth = new Date()
    const firstDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), 1)
    const lastDay = new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0)

    const { data: monthlyLogs } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", userId)
      .gte("started_at", firstDay.toISOString())
      .lte("started_at", lastDay.toISOString())
      .not("completed_at", "is", null)

    const { data: recentLogs } = await supabase
      .from("workout_logs")
      .select("started_at")
      .eq("user_id", userId)
      .not("completed_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(30)

    let streak = 0
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const log of recentLogs || []) {
      try {
        const logDate = new Date((log as any).started_at as string)
        logDate.setHours(0, 0, 0, 0)
        
        const daysDiff = Math.floor((today.getTime() - logDate.getTime()) / (1000 * 60 * 60 * 24))
        
        if (daysDiff === streak) {
          streak++
        } else if (daysDiff > streak) {
          break
        }
      } catch {
        // Invalid date, skip
      }
    }

    return {
      workoutsThisMonth: monthlyLogs?.length || 0,
      streakDays: streak
    }
  } catch (error) {
    console.error('Error fetching training stats:', error)
    return {
      workoutsThisMonth: 0,
      streakDays: 0
    }
  }
}

/**
 * Day of week mapping for proper sorting
 */
export const getDayOrder = (dayOfWeek: string): number => {
  const dayMap: Record<string, number> = {
    'segunda-feira': 1,
    'terça-feira': 2,
    'quarta-feira': 3,
    'quinta-feira': 4,
    'sexta-feira': 5,
    'sábado': 6,
    'domingo': 7
  }
  return dayMap[dayOfWeek] || 0
}

/**
 * Format workout duration for display
 */
export const formatDuration = (minutes: number | null): string => {
  if (!minutes) return "0 min"
  if (minutes < 60) return `${minutes} min`
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}min` : `${hours}h`
}

/**
 * Format muscle groups for display
 */
export const formatMuscleGroups = (muscleGroups: string[] | null): string => {
  if (!muscleGroups || muscleGroups.length === 0) return ""
  if (muscleGroups.length === 1) return muscleGroups[0]
  if (muscleGroups.length === 2) return muscleGroups.join(" e ")
  return `${muscleGroups.slice(0, -1).join(", ")} e ${muscleGroups[muscleGroups.length - 1]}`
}

/**
 * Format rest time for display
 */
export const formatRestTime = (seconds: number | null): string => {
  if (!seconds) return "0s"
  if (seconds < 60) return `${seconds}s`
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  return remainingSeconds > 0 ? `${minutes}m ${remainingSeconds}s` : `${minutes}m`
}

/**
 * Find active workout within 24h limit
 */
export const findActiveWorkout = async (userId: string, workoutTemplateId: string): Promise<string | null> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    throw new Error("Training tables not configured")
  }

  try {
    // Look for active workout for this template within 24h
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    console.log(`🔍 findActiveWorkout searching for user ${userId.slice(0, 8)}... template ${workoutTemplateId}`)
    
    const { data: activeWorkout, error } = await supabase
      .from("workout_logs")
      .select("id, started_at, user_id, workout_template_id")
      .eq("user_id", userId)
      .eq("workout_template_id", workoutTemplateId)
      .filter("completed_at", "is", null)
      .filter("finish", "eq", false)
      .gte("started_at", twentyFourHoursAgo)
      .order("started_at", { ascending: false })
      .limit(1)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    const result = activeWorkout ? (activeWorkout as any).id : null
    console.log(`🔍 findActiveWorkout result:`, {
      found: !!result,
      workoutId: result,
      workoutData: activeWorkout
    })

    return result
  } catch (error) {
    console.error('❌ Error finding active workout:', error)
    throw error
  }
}

/**
 * Create new workout (only called when first set is marked)
 */
export const createWorkout = async (userId: string, workoutTemplateId: string): Promise<string> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    throw new Error("Training tables not configured")
  }

  try {
    // Double-check for any active workout before creating (race condition protection)
    const existingActive = await findActiveWorkout(userId, workoutTemplateId)
    if (existingActive) {
      console.log('Found existing active workout during creation, using it:', existingActive)
      return existingActive
    }

    // Check for any active workout older than 24h and auto-finish them
    const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
    
    const { data: oldWorkouts } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", userId)
      .filter("completed_at", "is", null)
      .filter("finish", "eq", false)
      .lt("started_at", twentyFourHoursAgo)

    if (oldWorkouts && oldWorkouts.length > 0) {
      // Auto-finish old workouts as incomplete
      await Promise.all(
        oldWorkouts.map(workout => 
          finishWorkout((workout as any).id, false)
        )
      )
    }

    // Create new workout
    const { data, error } = await supabase
      .from("workout_logs")
      .insert({
        user_id: userId,
        workout_template_id: workoutTemplateId,
        started_at: new Date().toISOString(),
        finish: false
      } as any)
      .select("id")
      .single()

    if (error) {
      throw error
    }
    
    console.log('Created new workout:', (data as any).id)
    return (data as any).id
  } catch (error) {
    console.error('Error creating workout:', error)
    throw error
  }
}

/**
 * Log a completed set with duplicate prevention
 */
export const logCompletedSet = async (
  workoutLogId: string,
  exerciseId: string,
  setNumber: number,
  completedReps?: number,
  weightKg?: number
): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    throw new Error("Training tables not configured")
  }

  console.log(`📝 logCompletedSet called:`, {
    workoutLogId,
    exerciseId,
    setNumber,
    completedReps,
    weightKg
  })

  try {
    // First, check if this set is already logged
    const { data: existingSets, error: checkError } = await supabase
      .from("set_logs")
      .select("id")
      .eq("workout_log_id", workoutLogId)
      .eq("exercise_id", exerciseId)
      .eq("set_number", setNumber)

    if (checkError) throw checkError

    console.log(`🔍 Found ${existingSets?.length || 0} existing sets for workout ${workoutLogId}, exercise ${exerciseId}, set ${setNumber}`)

    // If there are existing sets, delete them first to avoid duplicates
    if (existingSets && existingSets.length > 0) {
      console.log(`🗑️ Deleting ${existingSets.length} existing sets to avoid duplicates`)
      const { error: deleteError } = await supabase
        .from("set_logs")
        .delete()
        .eq("workout_log_id", workoutLogId)
        .eq("exercise_id", exerciseId)
        .eq("set_number", setNumber)

      if (deleteError) throw deleteError
    }

    // Now insert the new set log
    console.log(`➕ Inserting new set log for workout ${workoutLogId}`)
    const { error } = await supabase
      .from("set_logs")
      .insert({
        workout_log_id: workoutLogId,
        exercise_id: exerciseId,
        set_number: setNumber,
        completed_reps: completedReps || null,
        weight_kg: weightKg || null,
        completed_at: new Date().toISOString()
      } as any)

    if (error) throw error
  } catch (error) {
    console.error('Error logging set:', error)
    throw error
  }
}

/**
 * Remove a logged set
 */
export const removeLoggedSet = async (
  workoutLogId: string,
  exerciseId: string,
  setNumber: number
): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    throw new Error("Training tables not configured")
  }

  try {
    const { error } = await supabase
      .from("set_logs")
      .delete()
      .eq("workout_log_id", workoutLogId)
      .eq("exercise_id", exerciseId)
      .eq("set_number", setNumber)

    if (error) throw error
  } catch (error) {
    console.error('Error removing set:', error)
    throw error
  }
}

// Global locks to prevent race conditions
const workoutCreationLocks = new Map<string, Promise<string>>()

// Enhanced debouncing system for rapid clicks
const operationDebounce = new Map<string, {
  timeout: NodeJS.Timeout,
  operations: Array<{resolve: Function, reject: Function, params: any}>
}>()

/**
 * Debounced workout creation that batches rapid calls
 */
const debouncedWorkoutCreation = (userId: string, workoutTemplateId: string): Promise<string> => {
  const lockKey = `${userId}-${workoutTemplateId}`
  
  return new Promise((resolve, reject) => {
    // Clear any existing timeout for this key
    if (operationDebounce.has(lockKey)) {
      clearTimeout(operationDebounce.get(lockKey)!.timeout)
      // Add this operation to the existing batch
      operationDebounce.get(lockKey)!.operations.push({resolve, reject, params: {userId, workoutTemplateId}})
    } else {
      // Create new batch for this key
      operationDebounce.set(lockKey, {
        timeout: setTimeout(() => {}, 0), // Will be overwritten below
        operations: [{resolve, reject, params: {userId, workoutTemplateId}}]
      })
    }

    // Set a very short debounce (50ms) to batch rapid successive calls
    const timeout = setTimeout(async () => {
      const batch = operationDebounce.get(lockKey)
      if (!batch) return

      console.log(`🚀 Processing batched workout creation for ${lockKey} (${batch.operations.length} operations)`)
      
      try {
        // Check if there's already an active workout
        let workoutId = await findActiveWorkout(userId, workoutTemplateId)
        
        // If no active workout exists, create one
        if (!workoutId) {
          // Check if creation is already in progress
          if (workoutCreationLocks.has(lockKey)) {
            workoutId = await workoutCreationLocks.get(lockKey)!
          } else {
            const creationPromise = createWorkout(userId, workoutTemplateId)
            workoutCreationLocks.set(lockKey, creationPromise)
            
            try {
              workoutId = await creationPromise
            } finally {
              workoutCreationLocks.delete(lockKey)
            }
          }
        }

        // Resolve all batched operations with the same workout ID
        batch.operations.forEach(op => op.resolve(workoutId))
        
      } catch (error) {
        console.error(`❌ Error in batched workout creation for ${lockKey}:`, error)
        // Reject all batched operations
        batch.operations.forEach(op => op.reject(error))
      } finally {
        // Clean up the batch
        operationDebounce.delete(lockKey)
      }
    }, 50) // 50ms debounce window

    // Update the timeout in the batch
    operationDebounce.get(lockKey)!.timeout = timeout
  })
}

/**
 * Find or create workout and log set (new workflow with race condition protection)
 */
export const findOrCreateWorkoutAndLogSet = async (
  userId: string,
  workoutTemplateId: string,
  exerciseId: string,
  setNumber: number,
  completedReps?: number,
  weightKg?: number
): Promise<string> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const lockKey = `${userId}-${workoutTemplateId}`
  
  console.log(`🔍 findOrCreateWorkoutAndLogSet called:`, {
    userId: userId.slice(0, 8) + '...',
    workoutTemplateId,
    exerciseId,
    setNumber,
    lockKey,
    hasActiveLock: workoutCreationLocks.has(lockKey)
  })
  
  try {
    // Use debounced workout creation to handle rapid clicks
    const workoutLogId = await debouncedWorkoutCreation(userId, workoutTemplateId)
    
    console.log(`✅ Got workout ID from debounced creation: ${workoutLogId}`)
    
    // Log the set
    console.log(`📝 Logging set ${setNumber} to workout ${workoutLogId}`)
    await logCompletedSet(workoutLogId, exerciseId, setNumber, completedReps, weightKg)
    
    return workoutLogId
  } catch (error) {
    console.error('❌ Error in findOrCreateWorkoutAndLogSet:', error)
    throw error
  }
}

/**
 * Finish a workout session
 */
export const finishWorkout = async (workoutLogId: string, isComplete: boolean = true): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    throw new Error("Training tables not configured")
  }

  try {
    const updateData = {
      completed_at: new Date().toISOString(),
      finish: true
    }

    const { error } = await (supabase as any)
      .from("workout_logs")
      .update(updateData)
      .eq("id", workoutLogId)

    if (error) throw error
  } catch (error) {
    console.error('Error finishing workout:', error)
    throw error
  }
}

/**
 * Mark all sets of an exercise as completed
 */
export const markExerciseComplete = async (
  userId: string,
  workoutTemplateId: string,
  exerciseId: string,
  sets: Array<{ setNumber: number; reps?: number; weight?: number }>
): Promise<string> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  try {
    // Find or create workout
    let workoutLogId = await findActiveWorkout(userId, workoutTemplateId)
    
    if (!workoutLogId) {
      workoutLogId = await createWorkout(userId, workoutTemplateId)
    }
    
    // Log all sets for this exercise
    await Promise.all(
      sets.map(set => 
        logCompletedSet(workoutLogId!, exerciseId, set.setNumber, set.reps, set.weight)
      )
    )
    
    return workoutLogId
  } catch (error) {
    console.error('Error marking exercise complete:', error)
    throw error
  }
}

/**
 * Get completed sets for a workout log
 */
export const getCompletedSets = async (workoutLogId: string): Promise<any[]> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    return []
  }

  try {
    const { data, error } = await supabase
      .from("set_logs")
      .select("*")
      .eq("workout_log_id", workoutLogId)
      .order("completed_at")

    if (error) throw error
    return data || []
  } catch (error) {
    console.error('Error getting completed sets:', error)
    return []
  }
}

/**
 * Check if workout was completed today
 */
export const checkWorkoutCompletedToday = async (userId: string, workoutTemplateId: string): Promise<boolean> => {
  if (!supabase) {
    return false
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    return false
  }

  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    const { data, error } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("workout_template_id", workoutTemplateId)
      .gte("started_at", today.toISOString())
      .lt("started_at", tomorrow.toISOString())
      .not("completed_at", "is", null)
      .limit(1)

    if (error) return false
    return (data && data.length > 0) || false
  } catch (error) {
    console.error('Error checking workout completion:', error)
    return false
  }
}

/**
 * Check if multiple workouts were completed this week - BATCH OPTIMIZED
 */
export const checkMultipleWorkoutsCompletedThisWeek = async (
  userId: string,
  workouts: Array<{ workoutTemplateId: string; dayOfWeek: string }>
): Promise<boolean[]> => {
  if (!supabase) {
    return workouts.map(() => false)
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    return workouts.map(() => false)
  }

  try {
    // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
    const dayMap: Record<string, number> = {
      'domingo': 0,
      'segunda-feira': 1,
      'terça-feira': 2,
      'quarta-feira': 3,
      'quinta-feira': 4,
      'sexta-feira': 5,
      'sábado': 6
    }

    // Get the current week's start (Monday)
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // Monday is day 1
    
    const mondayThisWeek = new Date(now)
    mondayThisWeek.setDate(now.getDate() + mondayOffset)
    mondayThisWeek.setHours(0, 0, 0, 0)

    const sundayThisWeek = new Date(mondayThisWeek)
    sundayThisWeek.setDate(mondayThisWeek.getDate() + 7)

    // Get all workout template IDs for batch query
    const workoutTemplateIds = workouts.map(w => w.workoutTemplateId).filter(Boolean)
    
    if (workoutTemplateIds.length === 0) {
      return workouts.map(() => false)
    }

    // Batch fetch all completed workouts for this week
    const { data, error } = await supabase
      .from("workout_logs")
      .select("workout_template_id, started_at")
      .eq("user_id", userId)
      .in("workout_template_id", workoutTemplateIds)
      .gte("started_at", mondayThisWeek.toISOString())
      .lt("started_at", sundayThisWeek.toISOString())
      .not("completed_at", "is", null)

    if (error) {
      console.error('Error checking multiple workout completions:', error)
      return workouts.map(() => false)
    }

    // Create a set of completed workouts by template ID and day
    const completedWorkouts = new Set<string>()
    
    if (data) {
      data.forEach((log: any) => {
        const logDate = new Date(log.started_at)
        const logDay = logDate.getDay()
        
        // Create a key combining template ID and day of week
        const key = `${log.workout_template_id}-${logDay}`
        completedWorkouts.add(key)
      })
    }

    // Check each workout against the completed set
    return workouts.map((workout) => {
      const targetDayNumber = dayMap[workout.dayOfWeek]
      if (targetDayNumber === undefined) {
        return false
      }
      
      const key = `${workout.workoutTemplateId}-${targetDayNumber}`
      return completedWorkouts.has(key)
    })

  } catch (error) {
    console.error('Error checking multiple workout completions:', error)
    return workouts.map(() => false)
  }
}

/**
 * Check if a workout was completed this week on its designated day
 */
export const checkWorkoutCompletedThisWeek = async (
  userId: string, 
  workoutTemplateId: string, 
  dayOfWeek: string
): Promise<boolean> => {
  if (!supabase) {
    return false
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    return false
  }

  try {
    // Map day names to day numbers (0 = Sunday, 1 = Monday, etc.)
    const dayMap: Record<string, number> = {
      'domingo': 0,
      'segunda-feira': 1,
      'terça-feira': 2,
      'quarta-feira': 3,
      'quinta-feira': 4,
      'sexta-feira': 5,
      'sábado': 6
    }

    const targetDayNumber = dayMap[dayOfWeek]
    if (targetDayNumber === undefined) {
      return false
    }

    // Get the current week's start (Monday) and the target day
    const now = new Date()
    const currentDay = now.getDay() // 0 = Sunday, 1 = Monday, etc.
    const mondayOffset = currentDay === 0 ? -6 : 1 - currentDay // Monday is day 1
    
    const mondayThisWeek = new Date(now)
    mondayThisWeek.setDate(now.getDate() + mondayOffset)
    mondayThisWeek.setHours(0, 0, 0, 0)

    // Calculate the target day of this week
    const targetDay = new Date(mondayThisWeek)
    const daysFromMonday = targetDayNumber === 0 ? 6 : targetDayNumber - 1 // Sunday = 6 days from Monday
    targetDay.setDate(mondayThisWeek.getDate() + daysFromMonday)

    const targetDayEnd = new Date(targetDay)
    targetDayEnd.setDate(targetDay.getDate() + 1)

    const { data, error } = await supabase
      .from("workout_logs")
      .select("id")
      .eq("user_id", userId)
      .eq("workout_template_id", workoutTemplateId)
      .gte("started_at", targetDay.toISOString())
      .lt("started_at", targetDayEnd.toISOString())
      .not("completed_at", "is", null)
      .limit(1)

    if (error) {
      console.error('Error checking weekly workout completion:', error)
      return false
    }
    
    return (data && data.length > 0) || false
  } catch (error) {
    console.error('Error checking weekly workout completion:', error)
    return false
  }
}

/**
 * Get active (uncompleted) workout for user
 */
export const getActiveWorkout = async (userId: string): Promise<WorkoutLogWithDetails | null> => {
  if (!supabase) {
    return null
  }

  const tablesExist = await checkTrainingTablesExist()
  if (!tablesExist) {
    return null
  }

  try {
    const { data: logs, error } = await supabase
      .from("workout_logs")
      .select(`
        *,
        workout_templates (*)
      `)
      .eq("user_id", userId)
      .filter("completed_at", "is", null)
      .order("started_at", { ascending: false })
      .limit(1)

    if (error) throw error
    if (!logs || logs.length === 0) return null

    const log = logs[0] as any
    const { data: sets } = await supabase
      .from("set_logs")
      .select("*")
      .eq("workout_log_id", log.id)

    return {
      ...(log as any),
      workout_template: (log as any).workout_templates,
      completed_sets: sets?.length || 0,
      duration_minutes: null
    } as unknown as WorkoutLogWithDetails
  } catch (error) {
    console.error('Error getting active workout:', error)
    return null
  }
}

/**
 * Diagnostic function to help debug workout/set assignment issues
 */
export const diagnoseWorkoutSets = async (userId: string): Promise<void> => {
  if (!supabase) {
    throw new Error("Supabase client not configured")
  }

  console.log(`🔬 DIAGNOSTIC: Starting workout sets analysis for user ${userId.slice(0, 8)}...`)

  try {
    // Get all workouts for user from last 7 days
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
    
    const { data: workouts, error: workoutError } = await supabase
      .from("workout_logs")
      .select(`
        id,
        workout_template_id,
        started_at,
        completed_at,
        finish,
        user_id,
        workout_templates!inner(name)
      `)
      .eq("user_id", userId)
      .gte("started_at", sevenDaysAgo)
      .order("started_at", { ascending: false })

    if (workoutError) throw workoutError

    console.log(`🔬 Found ${workouts?.length || 0} workouts in last 7 days`)

    for (const workout of workouts || []) {
      const { data: sets, error: setsError } = await supabase
        .from("set_logs")
        .select(`
          id,
          exercise_id,
          set_number,
          completed_at,
          workout_log_id,
          exercises!inner(name)
        `)
        .eq("workout_log_id", (workout as any).id)
        .order("completed_at", { ascending: true })

      if (setsError) {
        console.error(`❌ Error fetching sets for workout ${(workout as any).id}:`, setsError)
        continue
      }

      console.log(`🔬 WORKOUT ${(workout as any).id}:`, {
        template: (workout as any).workout_templates?.name,
        started: (workout as any).started_at,
        completed: (workout as any).completed_at,
        finished: (workout as any).finish,
        totalSets: sets?.length || 0
      })

      // Group sets by exercise
      const setsByExercise = (sets || []).reduce((acc: any, set: any) => {
        const exerciseName = set.exercises?.name || `Exercise ${set.exercise_id}`
        if (!acc[exerciseName]) acc[exerciseName] = []
        acc[exerciseName].push({
          setNumber: set.set_number,
          completedAt: set.completed_at,
          exerciseId: set.exercise_id
        })
        return acc
      }, {})

      Object.entries(setsByExercise).forEach(([exercise, exerciseSets]: [string, any]) => {
        console.log(`  📝 ${exercise}: ${exerciseSets.length} sets`, 
          exerciseSets.map((s: any) => `#${s.setNumber}`).join(', ')
        )
      })

      console.log('---')
    }

    // Check for orphaned sets (sets without valid workout)
    const { data: allRecentSets, error: orphanError } = await supabase
      .from("set_logs")
      .select(`
        id,
        workout_log_id,
        exercise_id,
        set_number,
        completed_at,
        exercises(name)
      `)
      .gte("completed_at", sevenDaysAgo)

    if (orphanError) {
      console.error("❌ Error checking for orphaned sets:", orphanError)
    } else if (allRecentSets) {
      const workoutIds = new Set((workouts || []).map(w => (w as any).id))
      const orphanedSets = allRecentSets.filter(set => !workoutIds.has((set as any).workout_log_id))
      
      if (orphanedSets.length > 0) {
        console.log(`⚠️  Found ${orphanedSets.length} orphaned sets (sets with non-existent workout IDs):`)
        orphanedSets.forEach(set => {
          console.log(`  - Set ${(set as any).set_number} for exercise ${(set as any).exercises?.name || (set as any).exercise_id} (workout: ${(set as any).workout_log_id})`)
        })
      } else {
        console.log("✅ No orphaned sets found")
      }
    }

  } catch (error) {
    console.error("❌ Error in diagnostic:", error)
  }
}
