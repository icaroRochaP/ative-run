import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  const { userId } = await request.json()
  if (!userId) {
    return NextResponse.json({ error: "Missing userId" }, { status: 400 })
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("onboarding_responses")
      .select(`*, onboarding_questions (*)`)
      .eq("user_id", userId)
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
