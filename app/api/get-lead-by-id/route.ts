import { NextResponse } from "next/server"
import { createAdminClient } from "@/lib/supabase-admin"

export async function POST(request: Request) {
  const { leadId } = await request.json()
  if (!leadId) {
    return NextResponse.json({ error: "Missing leadId" }, { status: 400 })
  }
  try {
    const supabase = createAdminClient()
    const { data, error } = await supabase
      .from("leads")
      .select("id, name, phone, user_id, onboarding")
      .eq("id", leadId)
      .single()
    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }
    return NextResponse.json({ data })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
