import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'
import { stravaApiClient } from '@/lib/strava'

const VERIFY_TOKEN = process.env.STRAVA_WEBHOOK_VERIFY_TOKEN || 'strava_webhook_verify_token_2024'

// GET - Verificação de webhook (subscription)
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    const hubMode = searchParams.get('hub.mode')
    const hubChallenge = searchParams.get('hub.challenge')
    const hubVerifyToken = searchParams.get('hub.verify_token')

    console.log('🔍 Webhook verification:', { hubMode, hubChallenge, hubVerifyToken })

    // Verificar se é uma requisição de verificação válida
    if (hubMode === 'subscribe' && hubVerifyToken === VERIFY_TOKEN) {
      console.log('✅ Webhook verification successful')
      
      // Salvar subscription no banco
      const supabase = createAdminClient()
      await supabase
        .from('strava_webhook_subscriptions')
        .upsert({
          subscription_id: parseInt(searchParams.get('subscription_id') || '0'),
          callback_url: request.url,
          verify_token: hubVerifyToken,
          hub_challenge: hubChallenge,
          active: true
        }, {
          onConflict: 'subscription_id'
        })

      // Retornar o challenge para confirmar a subscription
      return new NextResponse(hubChallenge, {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    }

    console.error('❌ Invalid webhook verification')
    return NextResponse.json({ error: 'Invalid verification' }, { status: 403 })

  } catch (error) {
    console.error('❌ Erro na verificação do webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST - Receber eventos do webhook
export async function POST(request: NextRequest) {
  try {
    const event = await request.json()
    
    console.log('📥 Webhook event received:', event)

    const supabase = createAdminClient()

    // Salvar evento no banco para auditoria
    const { data: eventRecord, error: eventError } = await supabase
      .from('strava_webhook_events')
      .insert({
        subscription_id: event.subscription_id,
        object_type: event.object_type,
        object_id: event.object_id,
        aspect_type: event.aspect_type,
        owner_id: event.owner_id,
        event_time: new Date(event.event_time * 1000).toISOString(),
        raw_event: event
      })
      .select('id')
      .single()

    if (eventError) {
      console.error('❌ Erro ao salvar evento:', eventError)
      return NextResponse.json({ error: 'Failed to save event' }, { status: 500 })
    }

    // Processar apenas eventos de atividades criadas ou atualizadas
    if (event.object_type === 'activity' && ['create', 'update'].includes(event.aspect_type)) {
      try {
        await processActivityEvent(event, eventRecord.id)
      } catch (processError) {
        console.error('❌ Erro ao processar atividade:', processError)
        // Marcar evento como com erro, mas não falhar o webhook
        await supabase
          .from('strava_webhook_events')
          .update({
            processed: false,
            error_message: processError instanceof Error ? processError.message : 'Unknown error'
          })
          .eq('id', eventRecord.id)
      }
    }

    // Responder rapidamente para o Strava
    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('❌ Erro no webhook:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

async function processActivityEvent(event: any, eventId: string) {
  const supabase = createAdminClient()

  try {
    // Encontrar usuário pelo Strava athlete ID
    const { data: userTokens, error: tokenError } = await supabase
      .from('strava_tokens')
      .select('user_id')
      .eq('strava_athlete_id', event.owner_id)
      .single()

    if (tokenError || !userTokens) {
      console.log('⚠️ Usuário não encontrado para athlete_id:', event.owner_id)
      return
    }

    const userId = userTokens.user_id

    // Buscar dados completos da atividade via API
    const activityData = await stravaApiClient.getActivity(userId, event.object_id.toString())

    // Salvar ou atualizar atividade no banco usando a tabela 'activities' existente
    const activityRecord = {
      user_id: userId,
      strava_activity_id: activityData.id,
      name: activityData.name,
      type: activityData.type,
      sport_type: activityData.sport_type,
      distance: activityData.distance,
      moving_time: activityData.moving_time,
      elapsed_time: activityData.elapsed_time,
      total_elevation_gain: activityData.total_elevation_gain,
      average_speed: activityData.average_speed,
      max_speed: activityData.max_speed,
      average_heartrate: activityData.average_heartrate,
      max_heartrate: activityData.max_heartrate,
      average_cadence: activityData.average_cadence,
      average_watts: activityData.average_watts,
      max_watts: activityData.max_watts,
      kilojoules: activityData.kilojoules,
      start_latlng: activityData.start_latlng ? `(${activityData.start_latlng[0]},${activityData.start_latlng[1]})` : null,
      end_latlng: activityData.end_latlng ? `(${activityData.end_latlng[0]},${activityData.end_latlng[1]})` : null,
      location_city: activityData.location_city,
      location_state: activityData.location_state,
      location_country: activityData.location_country,
      start_date: activityData.start_date,
      start_date_local: activityData.start_date_local,
      achievement_count: activityData.achievement_count,
      kudos_count: activityData.kudos_count,
      comment_count: activityData.comment_count,
      athlete_count: activityData.athlete_count,
      raw_data: activityData,
      processed: false, // Para ser processado pela IA posteriormente
      status: 'received' // Mantém compatibilidade com campo existente
    }

    const { error: saveError } = await supabase
      .from('activities')
      .upsert(activityRecord, {
        onConflict: 'strava_activity_id'
      })

    if (saveError) {
      throw saveError
    }

    // Marcar evento como processado
    await supabase
      .from('strava_webhook_events')
      .update({
        processed: true,
        processed_at: new Date().toISOString()
      })
      .eq('id', eventId)

    console.log('✅ Atividade processada:', {
      activityId: activityData.id,
      userId,
      type: activityData.type,
      distance: activityData.distance
    })

    // TODO: Aqui você pode adicionar a fila para processamento por IA
    // Por exemplo: enfileirar job para análise da atividade

  } catch (error) {
    console.error('❌ Erro ao processar atividade:', error)
    throw error
  }
}