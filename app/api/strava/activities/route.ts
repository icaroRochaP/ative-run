import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@/lib/supabase-server'
import { stravaApiClient, StravaRateLimiter } from '@/lib/strava'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const page = parseInt(searchParams.get('page') || '1')
    const perPage = parseInt(searchParams.get('per_page') || '10')
    const after = searchParams.get('after') // timestamp
    const before = searchParams.get('before') // timestamp
    const useCache = searchParams.get('use_cache') !== 'false' // Default true

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 })
    }

    // Verificar autenticação
    const supabase = await createServerClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Tentar buscar do cache primeiro (tabela activities)
    if (useCache) {
      let query = supabase
        .from('activities')
        .select(`
          strava_activity_id,
          name,
          type,
          sport_type,
          distance,
          moving_time,
          elapsed_time,
          total_elevation_gain,
          average_speed,
          max_speed,
          average_heartrate,
          max_heartrate,
          average_cadence,
          start_date,
          start_date_local,
          achievement_count,
          kudos_count,
          location_city,
          location_state,
          location_country
        `)
        .eq('user_id', userId)
        .not('strava_activity_id', 'is', null)
        .order('start_date', { ascending: false })

      // Aplicar filtros de data se fornecidos
      if (after) {
        const afterDate = new Date(parseInt(after) * 1000).toISOString()
        query = query.gte('start_date', afterDate)
      }
      if (before) {
        const beforeDate = new Date(parseInt(before) * 1000).toISOString()
        query = query.lte('start_date', beforeDate)
      }

      // Paginação
      const from = (page - 1) * perPage
      const to = from + perPage - 1
      query = query.range(from, to)

      const { data: cachedActivities, error: cacheError } = await query

      if (!cacheError && cachedActivities && cachedActivities.length > 0) {
        // Formatar dados para compatibilidade com API do Strava
        const formattedActivities = cachedActivities.map((activity: any) => ({
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
          average_cadence: activity.average_cadence,
          start_date: activity.start_date,
          start_date_local: activity.start_date_local,
          achievement_count: activity.achievement_count,
          kudos_count: activity.kudos_count,
          location_city: activity.location_city,
          location_state: activity.location_state,
          location_country: activity.location_country
        }))

        return NextResponse.json({
          success: true,
          data: formattedActivities,
          source: 'cache',
          pagination: {
            page,
            per_page: perPage,
            count: formattedActivities.length
          }
        })
      }
    }

    // Se não há cache ou foi solicitado dados frescos, buscar da API do Strava
    try {
      // Verificar rate limit
      await StravaRateLimiter.checkRateLimit(true)

      // Buscar atividades via API do Strava
      const activities = await stravaApiClient.getActivities(userId, {
        page,
        per_page: Math.min(perPage, 50), // Máximo 50 por página
        after: after ? parseInt(after) : undefined,
        before: before ? parseInt(before) : undefined
      })

      // Salvar no cache para futuras consultas
      if (activities.length > 0) {
        const activitiesToCache = activities.map(activity => ({
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
          start_latlng: activity.start_latlng ? `(${activity.start_latlng[0]},${activity.start_latlng[1]})` : null,
          end_latlng: activity.end_latlng ? `(${activity.end_latlng[0]},${activity.end_latlng[1]})` : null,
          location_city: activity.location_city,
          location_state: activity.location_state,
          location_country: activity.location_country,
          start_date: activity.start_date,
          start_date_local: activity.start_date_local,
          achievement_count: activity.achievement_count,
          kudos_count: activity.kudos_count,
          comment_count: activity.comment_count,
          athlete_count: activity.athlete_count,
          raw_data: activity,
          status: 'received',
          processed: false
        }))

        // Salvar em lote (upsert para evitar duplicatas)
        await supabase
          .from('activities')
          .upsert(activitiesToCache, {
            onConflict: 'strava_activity_id',
            ignoreDuplicates: true
          })
      }

      return NextResponse.json({
        success: true,
        data: activities,
        source: 'strava_api',
        pagination: {
          page,
          per_page: perPage,
          count: activities.length
        }
      })

    } catch (stravaError) {
      console.error('Erro ao buscar da API Strava:', stravaError)
      
      if (stravaError instanceof Error && stravaError.message.includes('Rate limit')) {
        return NextResponse.json({ 
          error: 'Rate limit exceeded',
          message: stravaError.message 
        }, { status: 429 })
      }

      // Se falhar, tentar retornar do cache mesmo que possa estar desatualizado
      try {
        const { data: fallbackActivities } = await supabase
          .from('activities')
          .select('*')
          .eq('user_id', userId)
          .not('strava_activity_id', 'is', null)
          .order('start_date', { ascending: false })
          .limit(perPage)

        if (fallbackActivities && fallbackActivities.length > 0) {
          return NextResponse.json({
            success: true,
            data: fallbackActivities,
            source: 'cache_fallback',
            warning: 'Dados podem estar desatualizados devido a erro na API do Strava'
          })
        }
      } catch (fallbackError) {
        console.error('Erro no fallback cache:', fallbackError)
      }

      throw stravaError
    }

  } catch (error) {
    console.error('Erro ao buscar atividades Strava:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
