import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

// Endpoint de teste para simular webhook do Strava com dados reais
export async function POST(request: NextRequest) {
  try {
    const supabase = createAdminClient()

    // Simular evento de webhook do Strava
    const mockEvent = {
      aspect_type: "create",
      event_time: Math.floor(Date.now() / 1000),
      object_id: 99887766554,
      object_type: "activity",
      owner_id: 12345678,
      subscription_id: 302513,
      updates: {}
    }

    console.log('🧪 TESTE: Simulando webhook event:', mockEvent)

    // 1. Salvar evento no banco para auditoria
    const { data: eventRecord, error: eventError } = await supabase
      .from('strava_webhook_events')
      .insert({
        subscription_id: mockEvent.subscription_id,
        object_type: mockEvent.object_type,
        object_id: mockEvent.object_id,
        aspect_type: mockEvent.aspect_type,
        owner_id: mockEvent.owner_id,
        event_time: new Date(mockEvent.event_time * 1000).toISOString(),
        raw_event: mockEvent
      })
      .select('id')
      .single()

    if (eventError) {
      console.error('❌ Erro ao salvar evento:', eventError)
      return NextResponse.json({ error: 'Failed to save event' }, { status: 500 })
    }

    // 2. Simular dados de uma corrida real (como se viessem da API do Strava)
    const mockActivityData = {
      id: 99887766554,
      name: "Corrida Matinal - Teste Webhook",
      type: "Run",
      sport_type: "Run",
      distance: 5200.5, // 5.2km
      moving_time: 1680, // 28 minutos
      elapsed_time: 1800, // 30 minutos total
      total_elevation_gain: 45.2,
      average_speed: 3.095, // m/s (pace ~5:20/km)
      max_speed: 4.5,
      average_heartrate: 155,
      max_heartrate: 175,
      average_cadence: 168,
      average_watts: null,
      max_watts: null,
      kilojoules: null,
      start_latlng: [-23.5505, -46.6333], // São Paulo
      end_latlng: [-23.5485, -46.6313],
      location_city: "São Paulo",
      location_state: "São Paulo",
      location_country: "Brazil",
      start_date: new Date().toISOString(),
      start_date_local: new Date().toISOString(),
      achievement_count: 2,
      kudos_count: 0,
      comment_count: 0,
      athlete_count: 1,
      weather: {
        temperature: 22,
        humidity: 65,
        condition: "Partly Cloudy"
      }
    }

    // 3. Simular usuário existente (vou usar um user_id genérico)
    const mockUserId = "123e4567-e89b-12d3-a456-426614174000" // UUID exemplo

    // 4. Salvar atividade no banco
    const activityRecord = {
      user_id: mockUserId,
      strava_activity_id: mockActivityData.id,
      name: mockActivityData.name,
      type: mockActivityData.type,
      sport_type: mockActivityData.sport_type,
      distance: mockActivityData.distance,
      moving_time: mockActivityData.moving_time,
      elapsed_time: mockActivityData.elapsed_time,
      total_elevation_gain: mockActivityData.total_elevation_gain,
      average_speed: mockActivityData.average_speed,
      max_speed: mockActivityData.max_speed,
      average_heartrate: mockActivityData.average_heartrate,
      max_heartrate: mockActivityData.max_heartrate,
      average_cadence: mockActivityData.average_cadence,
      average_watts: mockActivityData.average_watts,
      max_watts: mockActivityData.max_watts,
      kilojoules: mockActivityData.kilojoules,
      start_latlng: mockActivityData.start_latlng ? `(${mockActivityData.start_latlng[0]},${mockActivityData.start_latlng[1]})` : null,
      end_latlng: mockActivityData.end_latlng ? `(${mockActivityData.end_latlng[0]},${mockActivityData.end_latlng[1]})` : null,
      location_city: mockActivityData.location_city,
      location_state: mockActivityData.location_state,
      location_country: mockActivityData.location_country,
      start_date: mockActivityData.start_date,
      start_date_local: mockActivityData.start_date_local,
      achievement_count: mockActivityData.achievement_count,
      kudos_count: mockActivityData.kudos_count,
      comment_count: mockActivityData.comment_count,
      athlete_count: mockActivityData.athlete_count,
      raw_data: mockActivityData,
      processed: false,
      status: 'received'
    }

    const { data: activity, error: saveError } = await supabase
      .from('activities')
      .insert(activityRecord)
      .select('*')
      .single()

    if (saveError) {
      console.error('❌ Erro ao salvar atividade:', saveError)
      return NextResponse.json({ error: 'Failed to save activity', details: saveError }, { status: 500 })
    }

    // 5. Marcar evento como processado
    await supabase
      .from('strava_webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString()
      })
      .eq('id', eventRecord.id)

    console.log('✅ TESTE: Atividade simulada salva com sucesso:', {
      activityId: activity.id,
      stravaId: mockActivityData.id,
      name: mockActivityData.name,
      distance: `${(mockActivityData.distance / 1000).toFixed(2)}km`,
      time: `${Math.floor(mockActivityData.moving_time / 60)}min`,
      pace: `${Math.floor(1000 / mockActivityData.average_speed / 60)}:${Math.floor((1000 / mockActivityData.average_speed % 60)).toString().padStart(2, '0')}/km`
    })

    return NextResponse.json({
      success: true,
      message: "Webhook de teste processado com sucesso!",
      activity: {
        id: activity.id,
        strava_id: mockActivityData.id,
        name: mockActivityData.name,
        type: mockActivityData.type,
        distance_km: (mockActivityData.distance / 1000).toFixed(2),
        duration_min: Math.floor(mockActivityData.moving_time / 60),
        avg_pace: `${Math.floor(1000 / mockActivityData.average_speed / 60)}:${Math.floor((1000 / mockActivityData.average_speed % 60)).toString().padStart(2, '0')}/km`,
        avg_hr: mockActivityData.average_heartrate,
        location: `${mockActivityData.location_city}, ${mockActivityData.location_state}`,
        processed: false
      },
      event_id: eventRecord.id
    })

  } catch (error) {
    console.error('❌ Erro no teste de webhook:', error)
    return NextResponse.json({ 
      error: 'Internal server error', 
      details: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 })
  }
}
