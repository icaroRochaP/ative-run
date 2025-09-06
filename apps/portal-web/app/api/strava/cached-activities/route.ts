import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

export async function GET(request: NextRequest) {
  console.log('📊 Strava cached-activities: Buscando atividades do banco...')

  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      console.log('❌ Strava cached-activities: userId não fornecido')
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    console.log(`✅ Strava cached-activities: Buscando atividades para userId: ${userId}`)

    const supabase = createAdminClient()

    // Busca atividades do banco local
    const { data: activities, error, count } = await supabase
      .from('strava_activities')
      .select('*', { count: 'exact' })
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('❌ Strava cached-activities: Erro no banco:', error)
      return NextResponse.json({ error: 'Erro ao buscar atividades' }, { status: 500 })
    }

    console.log(`📊 Strava cached-activities: ${activities?.length || 0} atividades encontradas`)

    // Formatar dados para compatibilidade com o componente
    const formattedActivities = activities?.map(activity => ({
      id: activity.strava_activity_id,
      name: activity.name,
      type: activity.type,
      sport_type: activity.sport_type,
      distance: activity.distance,
      moving_time: activity.moving_time,
      elapsed_time: activity.elapsed_time,
      total_elevation_gain: activity.total_elevation_gain,
      average_speed: activity.average_speed,
      max_speed: activity.max_speed,
      average_heartrate: activity.average_heartrate,
      max_heartrate: activity.max_heartrate,
      start_date: activity.start_date,
      start_date_local: activity.start_date_local,
      achievement_count: activity.achievement_count,
      kudos_count: activity.kudos_count,
      // Campos extras do banco
      ai_analysis: activity.ai_analysis,
      processed: activity.processed,
      created_at: activity.created_at,
      updated_at: activity.updated_at
    })) || []

    return NextResponse.json({
      activities: formattedActivities,
      total: count || 0,
      hasMore: (offset + limit) < (count || 0)
    })

  } catch (error) {
    console.error('❌ Strava cached-activities: Erro na busca:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}
