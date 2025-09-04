import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const supabase = createAdminClient()
    
    // Verificar se o usuário existe
    const { data: user } = await supabase
      .from('users')
      .select('id')
      .eq('id', userId)
      .single()

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }

    // Buscar progresso calculado
    const { data: progressData, error: progressError } = await supabase
      .rpc('calculate_weight_progress', { user_uuid: userId })

    if (progressError) {
      console.error('Error calculating progress:', progressError)
      return NextResponse.json({ error: 'Failed to calculate progress' }, { status: 500 })
    }

    // Buscar histórico recente (últimos 10 registros)
    const { data: recentLogs, error: logsError } = await supabase
      .from('weight_progress_logs')
      .select('*')
      .eq('user_id', userId)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(10)

    if (logsError) {
      console.error('Error fetching logs:', logsError)
      return NextResponse.json({ error: 'Failed to fetch logs' }, { status: 500 })
    }

    // Buscar fotos de progresso recentes
    const { data: progressPhotos, error: photosError } = await supabase
      .from('progress_photos')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(20)

    if (photosError) {
      console.error('Error fetching photos:', photosError)
    }

    return NextResponse.json({
      progress: progressData,
      recent_logs: recentLogs || [],
      photos: progressPhotos || []
    })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    const body = await request.json()
    const { weight, date, notes, body_fat_percentage, muscle_mass_kg } = body

    const supabase = createAdminClient()

    if (!weight) {
      return NextResponse.json({ error: 'Weight is required' }, { status: 400 })
    }

    // Inserir novo registro de peso
    const { data: newLog, error: insertError } = await supabase
      .from('weight_progress_logs')
      .insert({
        user_id: userId,
        weight: parseFloat(weight),
        date: date || new Date().toISOString().split('T')[0],
        notes,
        body_fat_percentage: body_fat_percentage ? parseFloat(body_fat_percentage) : null,
        muscle_mass_kg: muscle_mass_kg ? parseFloat(muscle_mass_kg) : null
      })
      .select()
      .single()

    if (insertError) {
      console.error('Error inserting weight log:', insertError)
      return NextResponse.json({ error: 'Failed to add weight log' }, { status: 500 })
    }

    // Atualizar current_weight na meta ativa
    const { error: updateGoalError } = await supabase
      .from('user_weight_goals')
      .update({ current_weight: parseFloat(weight) })
      .eq('user_id', userId)
      .eq('is_active', true)

    if (updateGoalError) {
      console.error('Error updating goal:', updateGoalError)
    }

    return NextResponse.json({ success: true, data: newLog })

  } catch (error) {
    console.error('API Error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
