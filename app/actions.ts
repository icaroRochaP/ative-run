"use server"

import { createServerClient } from "@/lib/supabase-server"
import type { Database } from "@/lib/database.types"

type UserInsert = Database["public"]["Tables"]["users"]["Insert"]

/**
 * Server Action to create a user profile in the 'users' table.
 * This runs on the server, ensuring the RLS context is correctly applied
 * or allowing for service role key usage if needed.
 */
export async function createProfileForNewUser(profileData: UserInsert) {
  try {
    const supabase = await createServerClient()
    console.log("👤 Server Action: Attempting to insert user profile for ID:", profileData.id)

    const { error } = await supabase.from("users").insert(profileData)

    if (error) {
      console.error("❌ Server Action: Error creating user profile:", error)
      throw error
    }
    console.log("✅ Server Action: User profile created successfully for ID:", profileData.id)
  } catch (error) {
    console.error("❌ Server Action: Caught error in createProfileForNewUser:", error)
    throw error // Re-throw to propagate to the client
  }
}
