import { NextRequest, NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase-admin'

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_SERVICE_ROLE_KEY is required')
}

export async function GET(request: NextRequest) {
  try {
    console.log('SUPABASE_SERVICE_ROLE_KEY:', SUPABASE_SERVICE_ROLE_KEY?.substring(0, 50) + '...')
    
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!userId) {
      return NextResponse.json({ error: 'userId is required' }, { status: 400 })
    }

    console.log(`🔍 Strava saved activities: Buscando atividades salvas para userId: ${userId}`)
    
    const supabase = createAdminClient()
    console.log(`✅ Strava saved activities: Using admin client for user: ${userId}`)

    // Buscar atividades salvas no banco
    const { data: activities, error } = await supabase
      .from('activities')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false })
      .range(offset, offset + limit - 1)

    if (error) {
      console.error('❌ Database error:', error)
      return NextResponse.json({ error: 'Database error' }, { status: 500 })
    }

    console.log(`📊 Found ${activities?.length || 0} saved activities`)

    // Contar total de atividades para paginação
    const { count, error: countError } = await supabase
      .from('activities')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', userId)

    if (countError) {
      console.error('❌ Count error:', countError)
    }

    return NextResponse.json({
      activities: activities || [],
      total: count || 0,
      limit,
      offset,
      hasMore: (count || 0) > offset + limit
    })

  } catch (error) {
    console.error('❌ Strava saved activities error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch saved activities' },
      { status: 500 }
    )
  }
}
