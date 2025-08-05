import { supabase } from "./supabase"
import type { Database } from "./database.types"

type Workout = Database["public"]["Tables"]["workouts"]["Row"]
type WorkoutInsert = Database["public"]["Tables"]["workouts"]["Insert"]
type Exercise = Database["public"]["Tables"]["exercises"]["Row"]
type ExerciseInsert = Database["public"]["Tables"]["exercises"]["Insert"]

export const getWorkouts = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from("workouts")
    .select(`
      *,
      exercises (*)
    `)
    .eq("user_id", userId)
    .order("workout_date", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export const createWorkout = async (workout: WorkoutInsert) => {
  const { data, error } = await supabase.from("workouts").insert(workout).select().single()

  if (error) throw error
  return data
}

export const updateWorkout = async (id: string, updates: Partial<Workout>) => {
  const { data, error } = await supabase.from("workouts").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export const deleteWorkout = async (id: string) => {
  const { error } = await supabase.from("workouts").delete().eq("id", id)

  if (error) throw error
}

export const addExerciseToWorkout = async (exercise: ExerciseInsert) => {
  const { data, error } = await supabase.from("exercises").insert(exercise).select().single()

  if (error) throw error
  return data
}

export const updateExercise = async (id: string, updates: Partial<Exercise>) => {
  const { data, error } = await supabase.from("exercises").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export const getWorkoutStats = async (userId: string) => {
  const { data, error } = await supabase
    .from("workouts")
    .select("id, completed, workout_date")
    .eq("user_id", userId)
    .gte("workout_date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0])

  if (error) throw error

  const completedWorkouts = data.filter((w) => w.completed).length
  const totalWorkouts = data.length

  // Calculate streak
  const sortedWorkouts = data
    .filter((w) => w.completed)
    .sort((a, b) => new Date(b.workout_date).getTime() - new Date(a.workout_date).getTime())

  let streak = 0
  let currentDate = new Date()

  for (const workout of sortedWorkouts) {
    const workoutDate = new Date(workout.workout_date)
    const diffDays = Math.floor((currentDate.getTime() - workoutDate.getTime()) / (1000 * 60 * 60 * 24))

    if (diffDays <= streak + 1) {
      streak++
      currentDate = workoutDate
    } else {
      break
    }
  }

  return {
    completedWorkouts,
    totalWorkouts,
    streak,
  }
}
