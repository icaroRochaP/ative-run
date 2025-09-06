import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { stravaTokenManager } from '@/lib/strava-token-manager'

export async function POST(request: NextRequest) {
  console.log('🔄 Strava sync-activities: Iniciando sincronização...')

  try {
    const { userId } = await request.json()

    if (!userId) {
      console.log('❌ Strava sync-activities: userId não fornecido')
      return NextResponse.json({ error: 'userId é obrigatório' }, { status: 400 })
    }

    console.log(`✅ Strava sync-activities: Sincronizando atividades para userId: ${userId}`)

    const supabase = createAdminClient()

    // Verifica se o usuário está conectado ao Strava
    const isConnected = await stravaTokenManager.isUserConnected(userId)
    if (!isConnected) {
      console.log('❌ Strava sync-activities: Usuário não conectado ao Strava')
      return NextResponse.json({ error: 'Usuário não conectado ao Strava' }, { status: 400 })
    }

    // Busca as atividades da API do Strava
    const stravaActivities = await fetchAllStravaActivities(userId)
    console.log(`📊 Strava sync-activities: ${stravaActivities.length} atividades encontradas na API`)

    // Salva as atividades no banco
    const savedActivities = await saveActivitiesToDatabase(supabase, userId, stravaActivities)
    console.log(`💾 Strava sync-activities: ${savedActivities.length} atividades salvas/atualizadas`)

    return NextResponse.json({ 
      success: true, 
      syncedCount: savedActivities.length,
      totalFromStrava: stravaActivities.length 
    })

  } catch (error) {
    console.error('❌ Strava sync-activities: Erro na sincronização:', error)
    return NextResponse.json({ 
      error: 'Erro interno do servidor',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    }, { status: 500 })
  }
}

async function fetchAllStravaActivities(userId: string) {
  const activities = []
  let page = 1
  const perPage = 50 // Máximo permitido pela API do Strava

  while (true) {
    try {
      const response = await fetch(
        `http://localhost:3000/api/strava/activities?userId=${userId}&page=${page}&per_page=${perPage}`,
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      )

      if (!response.ok) {
        console.log(`⚠️ Erro ao buscar página ${page}: ${response.status}`)
        break
      }

      const pageActivities = await response.json()
      
      if (!Array.isArray(pageActivities) || pageActivities.length === 0) {
        console.log(`✅ Fim da paginação na página ${page}`)
        break
      }

      activities.push(...pageActivities)
      console.log(`📄 Página ${page}: ${pageActivities.length} atividades carregadas`)
      
      // Se retornou menos que per_page, é a última página
      if (pageActivities.length < perPage) {
        break
      }

      page++
    } catch (error) {
      console.error(`❌ Erro ao buscar página ${page}:`, error)
      break
    }
  }

  return activities
}

async function saveActivitiesToDatabase(supabase: any, userId: string, activities: any[]) {
  const savedActivities = []

  for (const activity of activities) {
    try {
      // Verifica se a atividade já existe
      const { data: existingActivity } = await supabase
        .from('strava_activities')
        .select('id, updated_at')
        .eq('strava_activity_id', activity.id)
        .single()

      const activityData = {
        user_id: userId,
        strava_activity_id: activity.id,
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
        average_cadence: activity.average_cadence,
        average_watts: activity.average_watts,
        max_watts: activity.max_watts,
        kilojoules: activity.kilojoules,
        start_date: activity.start_date,
        start_date_local: activity.start_date_local,
        achievement_count: activity.achievement_count || 0,
        kudos_count: activity.kudos_count || 0,
        comment_count: activity.comment_count || 0,
        athlete_count: activity.athlete_count || 1,
        location_city: activity.location_city,
        location_state: activity.location_state,
        location_country: activity.location_country,
        raw_data: activity,
        updated_at: new Date().toISOString()
      }

      if (existingActivity) {
        // Atualiza atividade existente
        const { error } = await supabase
          .from('strava_activities')
          .update(activityData)
          .eq('strava_activity_id', activity.id)

        if (error) {
          console.error(`❌ Erro ao atualizar atividade ${activity.id}:`, error)
        } else {
          console.log(`🔄 Atividade ${activity.id} atualizada`)
          savedActivities.push(activity)
        }
      } else {
        // Insere nova atividade
        const { error } = await supabase
          .from('strava_activities')
          .insert([activityData])

        if (error) {
          console.error(`❌ Erro ao inserir atividade ${activity.id}:`, error)
        } else {
          console.log(`➕ Nova atividade ${activity.id} inserida`)
          savedActivities.push(activity)
        }
      }
    } catch (error) {
      console.error(`❌ Erro ao processar atividade ${activity.id}:`, error)
    }
  }

  return savedActivities
}
