import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API weight-goals: Starting GET request...')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      console.log('❌ API weight-goals: No userId provided')
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }
    
    const supabase = createAdminClient()
    console.log('✅ API weight-goals: Supabase client created for user:', userId)

    const { data, error } = await supabase
      .from('user_weight_goals')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (error && error.code !== 'PGRST116') {
      throw error
    }

    return NextResponse.json({
      success: true,
      data: data || null
    })
  } catch (error) {
    console.error('Error fetching weight goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch weight goal' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, target_weight, current_weight, start_weight, target_date, notes } = body
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Validação
    if (!target_weight) {
      return NextResponse.json(
        { success: false, error: 'Target weight is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('user_weight_goals')
      .insert({
        user_id: userId,
        target_weight,
        current_weight: current_weight || null,
        start_weight: start_weight || null,
        target_date: target_date || null,
        notes: notes || null
      })
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error creating weight goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to create weight goal' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, target_weight, current_weight, start_weight, target_date, notes } = body
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = createAdminClient()

    // Validação
    if (!target_weight) {
      return NextResponse.json(
        { success: false, error: 'Target weight is required' },
        { status: 400 }
      )
    }

    const { data, error } = await supabase
      .from('user_weight_goals')
      .update({
        target_weight,
        current_weight: current_weight || null,
        start_weight: start_weight || null,
        target_date: target_date || null,
        notes: notes || null,
        updated_at: new Date().toISOString()
      })
      .eq('user_id', userId)
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json({
      success: true,
      data
    })
  } catch (error) {
    console.error('Error updating weight goal:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to update weight goal' },
      { status: 500 }
    )
  }
}
