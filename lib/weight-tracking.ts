import { supabase } from "./supabase"
import type { Database } from "./database.types"

type WeightUpdate = Database["public"]["Tables"]["weight_updates"]["Row"]
type WeightUpdateInsert = Database["public"]["Tables"]["weight_updates"]["Insert"]

export const getWeightUpdates = async (userId: string, limit = 10) => {
  const { data, error } = await supabase
    .from("weight_updates")
    .select("*")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(limit)

  if (error) throw error
  return data
}

export const addWeightUpdate = async (weightUpdate: WeightUpdateInsert) => {
  const { data, error } = await supabase.from("weight_updates").insert(weightUpdate).select().single()

  if (error) throw error
  return data
}

export const updateWeightUpdate = async (id: string, updates: Partial<WeightUpdate>) => {
  const { data, error } = await supabase.from("weight_updates").update(updates).eq("id", id).select().single()

  if (error) throw error
  return data
}

export const deleteWeightUpdate = async (id: string) => {
  const { error } = await supabase.from("weight_updates").delete().eq("id", id)

  if (error) throw error
}

export const getLatestWeight = async (userId: string) => {
  const { data, error } = await supabase
    .from("weight_updates")
    .select("weight, date")
    .eq("user_id", userId)
    .order("date", { ascending: false })
    .limit(1)
    .single()

  if (error && error.code !== "PGRST116") throw error
  return data
}
